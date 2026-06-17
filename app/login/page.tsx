'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const supabase = getSupabaseBrowser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (isSignUp) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        })

        if (signUpError) throw signUpError

        if (data.user) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .upsert({
              id: data.user.id,
              email: data.user.email!,
              full_name: fullName || null,
            })

          if (profileError) {
            console.error('Error updating profile:', profileError)
          }
        }

        setSuccess('Account created successfully. You can now sign in.')
        setIsSignUp(false)
        setPassword('')
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInError) throw signInError

        router.push('/admin')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-ink mb-2">Nomichi Trip Desk</h1>
          <p className="text-ink/70">
            {isSignUp ? 'Create your team member account' : 'Sign in to manage trips and leads'}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-ink mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none text-ink bg-white"
                  placeholder="Your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none text-ink bg-white"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ink mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rust focus:border-transparent outline-none text-ink bg-white"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rust text-white py-3 rounded-lg font-medium hover:bg-rust/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError('')
                setSuccess('')
              }}
              className="text-rust hover:underline font-medium text-sm"
            >
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Create one'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
