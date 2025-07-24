import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Fallback values for development

VITE_SUPABASE_URL="https://bddfiuquirpuuotjsgko.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkZGZpdXF1aXJwdXVvdGpzZ2tvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4NTQxNzMsImV4cCI6MjA2ODQzMDE3M30.Wjyp9lf0PpyNWiMbhw9Mx4b6svNl8xlydVpystDApiU"


const finalUrl = supabaseUrl || defaultUrl;
const finalKey = supabaseAnonKey || defaultKey;

// Only warn about missing env vars, don't throw error
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Using fallback Supabase configuration');
}

export const supabase = createClient<Database>(finalUrl, finalKey);