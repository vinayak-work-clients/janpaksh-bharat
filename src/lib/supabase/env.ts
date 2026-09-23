/** Public Supabase env with a clear error when missing. */
export function supabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
    );
  }
  return { url, anonKey };
}

/** True when the public Supabase env is present (used to guard optional paths). */
export function hasSupabaseEnv(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export type DataSource = "mock" | "supabase";

/** Where public pages read from. Defaults to mock. */
export function dataSource(): DataSource {
  return process.env.DATA_SOURCE === "supabase" ? "supabase" : "mock";
}
