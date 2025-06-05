"use client"

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Demo mode - return mock client
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: () => Promise.resolve({ error: null }),
        signInWithPassword: () => Promise.resolve({ error: { message: 'Demo mode - use localStorage' } }),
        signUp: () => Promise.resolve({ error: { message: 'Demo mode - use localStorage' } }),
        signInWithOAuth: () => Promise.resolve({ error: { message: 'Demo mode - use localStorage' } })
      }
    }
  }
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  
  return createBrowserClient(supabaseUrl, supabaseKey)
}