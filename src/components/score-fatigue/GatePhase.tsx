import { useForm } from "@tanstack/react-form";
import { z } from "zod";

import { cn } from "@/lib/utils";

import type { FatigueResult } from "./types";

const INPUT_CLASS =
  "border-border bg-card text-foreground placeholder-muted-foreground/70 focus:border-primary w-full rounded-xl border px-4 py-3 text-sm transition-colors duration-200 focus:outline-none";

const ERROR_CLASS = "text-primary/70 mt-1 text-xs";

const gateSchema = z.object({
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
});

function FormLabel({ label }: { label: string }) {
  return (
    <label className="text-muted-foreground mb-2 block text-xs font-semibold tracking-wider uppercase">
      {label} <span className="text-primary">*</span>
    </label>
  );
}

export function GatePhase({
  result,
  answers,
  onSubmitted,
}: {
  result: FatigueResult | null;
  answers: Record<string, string>;
  onSubmitted: () => void;
}) {
  const form = useForm({
    defaultValues: { firstName: "", lastName: "", phone: "" },
    validators: { onSubmit: gateSchema },
    async onSubmit({ value }) {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: value.firstName,
          lastName: value.lastName,
          phone: value.phone,
          leadMagnet: "sleep-score",
          resultKey: result?.key,
          answers,
        }),
      });

      if (!res.ok) {
        throw new Error("Une erreur est survenue, merci de réessayer.");
      }

      onSubmitted();
    },
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 text-center">
        <div className="border-primary/30 bg-primary/10 text-primary/70 mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold tracking-wider uppercase">
          <span>✓</span>
          <span>Quiz terminé : Ton analyse est prête</span>
        </div>

        <h2 className="text-foreground mb-3 text-2xl font-bold md:text-3xl">
          Accède à ton profil de fatigue
        </h2>
        <p className="text-muted-foreground mx-auto max-w-sm text-sm leading-relaxed">
          Remplis tes informations ci-dessous. Je t'enverrai ton analyse personnalisée et pourrai te
          contacter directement.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="mx-auto max-w-sm space-y-4"
      >
        <form.Field name="firstName">
          {(field) => (
            <div>
              <FormLabel label="Prénom" />
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Ton prénom"
                autoComplete="given-name"
                className={INPUT_CLASS}
              />
              {field.state.meta.errors.length > 0 && (
                <p className={ERROR_CLASS}>{field.state.meta.errors[0]?.message}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="lastName">
          {(field) => (
            <div>
              <FormLabel label="Nom" />
              <input
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                placeholder="Ton nom de famille"
                autoComplete="family-name"
                className={INPUT_CLASS}
              />
              {field.state.meta.errors.length > 0 && (
                <p className={ERROR_CLASS}>{field.state.meta.errors[0]?.message}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="phone">
          {(field) => (
            <div>
              <FormLabel label="Téléphone" />
              <input
                type="tel"
                value={field.state.value}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9\s+\-().]/g, "");
                  field.handleChange(cleaned);
                }}
                onBlur={field.handleBlur}
                placeholder="+33 6 12 34 56 78"
                autoComplete="tel"
                inputMode="tel"
                className={INPUT_CLASS}
              />
              {field.state.meta.errors.length > 0 && (
                <p className={ERROR_CLASS}>{field.state.meta.errors[0]?.message}</p>
              )}
            </div>
          )}
        </form.Field>

        <form.Subscribe selector={(s) => s.errorMap.onSubmit}>
          {(error) =>
            error && (
              <div className="border-primary/30 bg-primary/10 rounded-xl border px-4 py-3">
                <p className="text-primary/70 text-xs">{String(error)}</p>
              </div>
            )
          }
        </form.Subscribe>

        <form.Subscribe selector={(s) => s.isSubmitting}>
          {(isSubmitting) => (
            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "text-primary-foreground mt-2 w-full rounded-xl px-6 py-4 text-sm font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
                isSubmitting ? "bg-primary/50" : "from-primary to-primary/80 bg-gradient-to-br",
              )}
            >
              {isSubmitting ? "Chargement de ton analyse…" : "Découvrir mon profil de fatigue →"}
            </button>
          )}
        </form.Subscribe>

        <p className="text-muted-foreground/70 text-center text-xs leading-relaxed">
          🔒 Tes informations restent confidentielles.
          <br />
          Aucun spam : juste ton analyse et un contact humain.
        </p>
      </form>
    </div>
  );
}
