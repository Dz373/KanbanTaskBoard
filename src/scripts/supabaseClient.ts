import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fzktmserivnnexohsiaj.supabase.co';
const supabaseKey = 'sb_publishable_4gatHcNpoE680qfp8uZk_g_CRLJKSuR';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
export default supabase;
