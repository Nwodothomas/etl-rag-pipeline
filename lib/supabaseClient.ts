import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicSupabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !publicSupabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

const validatedSupabaseUrl = supabaseUrl;
const validatedPublicSupabaseKey = publicSupabaseKey;

const supabase = createClient(validatedSupabaseUrl, validatedPublicSupabaseKey);

export function getSupabaseServerClient() {
  return createClient(
    validatedSupabaseUrl,
    serviceRoleKey ?? validatedPublicSupabaseKey
  );
}

export default supabase;
