import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://supabase.co'
const supabaseKey = 'sb_publishable_4gatHcNpoE680qfp8uZk_g_CRLJKSuR'
export const supabase = createClient(supabaseUrl, supabaseKey)
