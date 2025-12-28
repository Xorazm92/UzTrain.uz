import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database types
export interface Company {
  id: string;
  name: string;
  level: 'management' | 'supervisor' | 'subsidiary';
  parent: string | null;
  profile: string;
  employees: number;
  total_hours: number;
  kpis: Record<string, KPIResult>;
  overall_index: number;
  zone: 'green' | 'yellow' | 'red';
  date_added: string;
  raw_data: Record<string, any>;
  updated_at: string;
}

export interface KPIResult {
  value: number;
  score: number;
}
