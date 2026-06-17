import { createBrowserClient, createServerClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Browser Client for Client Components
export const getSupabaseBrowser = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {} as any
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Server Client for Server Components / API Routes / Route Handlers
export const getSupabaseServer = (cookieStore: any) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {} as any
  }
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // Ignore write failures in Read-only / Server Component context
        }
      },
    },
  })
}

