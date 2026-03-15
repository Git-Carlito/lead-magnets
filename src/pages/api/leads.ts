import type { APIContext } from "astro";
import { z } from "zod";

import { getSupabase } from "@/lib/supabase";

const leadSchema = z.object({
  firstName: z.string().trim().min(1, "Champ obligatoire"),
  lastName: z.string().trim().min(1, "Champ obligatoire"),
  phone: z
    .string()
    .trim()
    .min(1, "Champ obligatoire")
    .refine(
      (v) => v.replace(/\D/g, "").length >= 6,
      "Merci d'entrer un numéro de téléphone valide.",
    ),
  leadMagnet: z.string().min(1),
  resultKey: z.string().optional(),
  answers: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
});

// Simple in-memory rate limiter: max 5 requests per IP per 60s
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX) {
    hits.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  hits.set(ip, timestamps);
  return false;
}

export async function POST({ request, clientAddress }: APIContext) {
  if (isRateLimited(clientAddress)) {
    return new Response(JSON.stringify({ error: "Trop de requêtes, réessaie dans une minute." }), {
      status: 429,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Corps de requête invalide." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({ error: "Données invalides.", issues: parsed.error.issues }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }

  const { firstName, lastName, phone, leadMagnet, resultKey, answers } = parsed.data;

  const { error } = await getSupabase()
    .from("leads")
    .insert({
      first_name: firstName,
      last_name: lastName,
      phone,
      lead_magnet: leadMagnet,
      answers: answers ?? {},
      result: resultKey,
    });

  if (error) {
    console.error("Supabase insert error:", error);
    return new Response(JSON.stringify({ error: "Erreur serveur, réessaie plus tard." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
