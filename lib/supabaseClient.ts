import { createClient } from '@supabase/supabase-js';
import { getPublicSupabaseEnv, getServerSupabaseEnv } from '@/lib/env';

const { supabaseUrl: validatedSupabaseUrl, publicSupabaseKey: validatedPublicSupabaseKey } =
  getPublicSupabaseEnv();

const supabase = createClient(validatedSupabaseUrl, validatedPublicSupabaseKey);

export function getSupabaseServerClient() {
  const { serviceRoleKey } = getServerSupabaseEnv();

  return createClient(
    validatedSupabaseUrl,
    serviceRoleKey ?? validatedPublicSupabaseKey
  );
}

export default supabase;
