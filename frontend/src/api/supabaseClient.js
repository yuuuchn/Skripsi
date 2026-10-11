import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://avxhfccingozmyscoagb.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_2UlwaOF4SEp5N1-wY_qFcQ_mJ0SOhvm';

export const supabase = createClient(supabaseUrl, supabaseKey);
