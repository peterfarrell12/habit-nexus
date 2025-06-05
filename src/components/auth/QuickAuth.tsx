"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/auth"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight,
  Github,
  Chrome
} from "lucide-react"

interface QuickAuthProps {
  isOpen: boolean
  onClose: () => void
}

export function QuickAuth({ isOpen, onClose }: QuickAuthProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const supabase = createClient()

  const handleEmailAuth = async () => {
    setLoading(true)
    setError('')
    
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        setError('Check your email for confirmation link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        onClose()
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialAuth = async (provider: 'google' | 'github') => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    // Create demo user experience
    onClose()
    // In a real app, you might set a demo flag in localStorage
    localStorage.setItem('demo_mode', 'true')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-sm bg-gradient-to-br from-cyber-dark to-cyber-light rounded-2xl glass-dark border border-white/20 overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 text-center border-b border-white/10">
              <motion.div
                className="inline-flex items-center space-x-2 mb-4"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Sparkles className="w-6 h-6 text-neon-blue" />
                <h2 className="text-xl font-bold text-white">
                  {mode === 'signin' ? 'Welcome Back' : 'Join Habit Nexus'}
                </h2>
              </motion.div>
              <p className="text-white/70 text-sm">
                {mode === 'signin' 
                  ? 'Access your neural consciousness' 
                  : 'Begin your transformation journey'
                }
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Mode Toggle */}
              <div className="flex bg-black/20 rounded-lg p-1">
                {['signin', 'signup'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m as 'signin' | 'signup')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                      mode === m
                        ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-lg'
                        : 'text-white/60 hover:text-white/80'
                    }`}
                  >
                    {m === 'signin' ? 'Sign In' : 'Sign Up'}
                  </button>
                ))}
              </div>

              {/* Social Auth */}
              <div className="space-y-3">
                <motion.button
                  onClick={() => handleSocialAuth('google')}
                  className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-300"
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  <Chrome className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Continue with Google</span>
                </motion.button>

                <motion.button
                  onClick={() => handleSocialAuth('github')}
                  className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all duration-300"
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                >
                  <Github className="w-5 h-5 text-white" />
                  <span className="text-white font-medium">Continue with GitHub</span>
                </motion.button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-cyber-dark text-white/60">or</span>
                </div>
              </div>

              {/* Email Auth */}
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-neon-blue focus:outline-none transition-colors"
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-black/20 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-neon-blue focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <motion.button
                  onClick={handleEmailAuth}
                  disabled={loading || !email || !password}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.98 }}
                >
                  <span>{loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </motion.button>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm text-center"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {error}
                </motion.div>
              )}

              {/* Demo Mode */}
              <div className="text-center">
                <button
                  onClick={handleDemoLogin}
                  className="text-sm text-white/60 hover:text-white/80 underline transition-colors"
                >
                  Continue with Demo Mode
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}