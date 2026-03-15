import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = import.meta.env.SUPABASE_URL;
    const key = import.meta.env.SUPABASE_SECRET_KEY;
    _supabase = createClient(url, key);
  }
  return _supabase;
}
