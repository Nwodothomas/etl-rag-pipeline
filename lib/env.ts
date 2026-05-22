type PublicSupabaseEnv = {
  supabaseUrl: string;
  publicSupabaseKey: string;
};

type ServerSupabaseEnv = PublicSupabaseEnv & {
  serviceRoleKey?: string;
  storageBucket: string;
  storageHistoryPrefix: string;
  ragBackendBaseUrl?: string;
};

export function getPublicSupabaseEnv(): PublicSupabaseEnv {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publicSupabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || !publicSupabaseKey) {
    throw new Error(
      "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return {
    supabaseUrl,
    publicSupabaseKey,
  };
}

export function getServerSupabaseEnv(): ServerSupabaseEnv {
  const { supabaseUrl, publicSupabaseKey } = getPublicSupabaseEnv();

  return {
    supabaseUrl,
    publicSupabaseKey,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    storageBucket: process.env.SUPABASE_STORAGE_BUCKET ?? "knowledge-base",
    storageHistoryPrefix: process.env.SUPABASE_STORAGE_HISTORY_PREFIX ?? "",
    ragBackendBaseUrl: process.env.RAG_BACKEND_BASE_URL,
  };
}
