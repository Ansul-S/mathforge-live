import { createClient } from '@supabase/supabase-js';

// Fallback to placeholder values if env vars are missing to prevent build/runtime errors
// The app will load, but Supabase features won't work until real keys are provided
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
