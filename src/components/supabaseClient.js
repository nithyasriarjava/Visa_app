import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ifpbxwryoawbzjvvmcnn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlmcGJ4d3J5b2F3YnpqdnZtY25uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NjA5NzYsImV4cCI6MjA4MDIzNjk3Nn0.YABc2UPEHOccV_LUKVdNKuiBt8dCM7IEmn_jYLgM1Kw'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
