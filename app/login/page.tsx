'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiMail, FiLock, FiUser, FiArrowRight } from 'react-icons/fi'
import Link from 'next/link'

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

        setSuccess('Account created successfully. Please check your email for a confirmation link.')
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
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      
      {/* ── Left Side: Brand Visual Panel ── */}
      <div className="hidden md:flex md:w-1/2 relative bg-ink overflow-hidden items-center p-16">
        <div className="absolute inset-0 scale-105">
          <img
            src="/images/spiti_valley.png"
            alt="Nomichi Journeys"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-ink via-ink/85 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-md mt-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-sand hover:text-cream transition-colors font-semibold font-sans mb-8 group"
          >
            <FiArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to homepage
          </Link>
          <span className="text-[10px] uppercase tracking-widest text-rust font-bold block mb-4 font-sans">Nomichi Portal</span>
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-cream leading-tight mb-6">
            Travel that<br />
            <span className="text-sand italic">finds you.</span>
          </h2>
          <p className="text-xs text-cream/60 leading-relaxed font-sans font-light max-w-sm">
            We design slow, offbeat, small-group journeys for people who want a trip to feel personal. Sign in to your workspace workspace.
          </p>
        </div>
      </div>

      {/* ── Right Side: Auth Form ── */}
      <div className="flex-grow flex items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="mb-10 text-center md:text-left">
            <span className="text-[9px] uppercase tracking-widest text-olive font-bold block mb-2 font-sans">
              Internal Workspace
            </span>
            <h1 className="text-3xl font-display font-bold text-ink mb-2">
              {isSignUp ? 'Join the Team' : 'Team Portal'}
            </h1>
            <p className="text-xs text-ink/60 font-sans font-light">
              {isSignUp ? 'Create a workspace account.' : 'Sign in to manage journeys and enquiries.'}
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white border border-sand/35 p-8 shadow-[0_8px_30px_rgba(28,27,26,0.02)]">
            {error && (
              <div className="bg-rust/5 border border-rust/35 text-rust px-4 py-3 text-xs font-sans font-medium mb-5">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-olive/5 border border-olive/35 text-olive px-4 py-3 text-xs font-sans font-medium mb-5">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {isSignUp && (
                <div>
                  <label htmlFor="fullName" className="block text-[10px] uppercase tracking-widest font-semibold text-ink/75 mb-2 font-sans">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-olive/55" />
                    <input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 border border-sand/40 bg-cream/10 rounded-sm focus:ring-1 focus:ring-rust/30 focus:border-rust outline-none text-xs font-sans text-ink transition-all placeholder-ink/25"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-[10px] uppercase tracking-widest font-semibold text-ink/75 mb-2 font-sans">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-olive/55" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-sand/40 bg-cream/10 rounded-sm focus:ring-1 focus:ring-rust/30 focus:border-rust outline-none text-xs font-sans text-ink transition-all placeholder-ink/25"
                    placeholder="you@thenomichi.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-[10px] uppercase tracking-widest font-semibold text-ink/75 mb-2 font-sans">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-olive/55" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-sand/40 bg-cream/10 rounded-sm focus:ring-1 focus:ring-rust/30 focus:border-rust outline-none text-xs font-sans text-ink transition-all placeholder-ink/25"
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-cream py-3.5 font-bold text-[10px] tracking-widest uppercase hover:bg-rust hover:text-cream border border-ink hover:border-rust transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-sans flex items-center justify-center gap-2 mt-4"
              >
                {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                {!loading && <FiArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-sand/20 text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError('')
                  setSuccess('')
                }}
                className="font-sans text-[9px] tracking-widest uppercase font-bold text-olive hover:text-rust transition-colors duration-250 border-b border-transparent hover:border-rust pb-0.5"
              >
                {isSignUp ? 'Already have an account? Sign In' : 'Need a workspace? Register'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}
