import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wnvviathstqscskifolf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndudnZpYXRoc3Rxc2Nza2lmb2xmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODA5OTIsImV4cCI6MjA3NDQ1Njk5Mn0.xsQ5hi8lL32hN0JdHLWA9pCXofCunJ5d4tMcAkqXm3g'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
