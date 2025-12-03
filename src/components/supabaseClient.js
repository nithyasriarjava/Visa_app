import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rtjhwgiffujdqaskkqkp.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0amh3Z2lmZnVqZHFhc2trcWtwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NjA3NDMsImV4cCI6MjA4MDIzNjc0M30.GC2GVhbKDy0KtN7v1J6_kezR0U553ewgm44kizBhocM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
