"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from "@/lib/auth"
import { Button } from "@/components/ui/Button"
import { X, Sparkles, Zap, Brain } from "lucide-react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [view, setView] = useState<'sign_in' | 'sign_up' | 'magic_link' | 'forgot_password'>('sign_in')
  const supabase = createClient()

  const authTheme = {
    default: {
      colors: {
        brand: '#00f0ff',
        brandAccent: '#a855f7',
        brandButtonText: 'white',
        defaultButtonBackground: 'rgba(255, 255, 255, 0.05)',
        defaultButtonBackgroundHover: 'rgba(255, 255, 255, 0.1)',
        defaultButtonBorder: 'rgba(255, 255, 255, 0.2)',
        defaultButtonText: 'white',
        dividerBackground: 'rgba(255, 255, 255, 0.1)',
        inputBackground: 'rgba(0, 0, 0, 0.2)',
        inputBorder: 'rgba(255, 255, 255, 0.2)',
        inputBorderHover: 'rgba(0, 240, 255, 0.5)',
        inputBorderFocus: 'rgba(0, 240, 255, 0.8)',
        inputText: 'white',
        inputLabelText: 'rgba(255, 255, 255, 0.9)',
        inputPlaceholder: 'rgba(255, 255, 255, 0.5)',
        messageText: 'white',
        messageTextDanger: '#ef4444',
        anchorTextColor: '#00f0ff',
        anchorTextHoverColor: '#a855f7',
      },
      space: {
        spaceSmall: '4px',
        spaceMedium: '8px',
        spaceLarge: '16px',
        labelBottomMargin: '8px',
        anchorBottomMargin: '4px',
        emailInputSpacing: '4px',
        socialAuthSpacing: '4px',
        buttonPadding: '10px 15px',
        inputPadding: '10px 15px',
      },
      fontSizes: {
        baseBodySize: '13px',
        baseInputSize: '14px',
        baseLabelSize: '14px',
        baseButtonSize: '14px',
      },
      fonts: {
        bodyFontFamily: `ui-sans-serif, sans-serif`,
        buttonFontFamily: `ui-sans-serif, sans-serif`,
        inputFontFamily: `ui-sans-serif, sans-serif`,
        labelFontFamily: `ui-sans-serif, sans-serif`,
      },
      borderWidths: {
        buttonBorderWidth: '1px',
        inputBorderWidth: '1px',
      },
      radii: {
        borderRadiusButton: '8px',
        buttonBorderRadius: '8px',
        inputBorderRadius: '8px',
      },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-dark p-8 rounded-2xl border border-white/20 w-full max-w-md relative overflow-hidden"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-neon-blue rounded-full"
                  animate={{
                    x: [0, 50, -30, 0],
                    y: [0, -30, 20, 0],
                    opacity: [0, 1, 0.5, 0],
                    scale: [0, 1, 0.5, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                  style={{
                    left: `${10 + i * 10}%`,
                    top: `${20 + i * 8}%`
                  }}
                />
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="inline-flex items-center space-x-2 mb-4"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Sparkles className="w-8 h-8 text-neon-blue" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                  Welcome
                </h2>
                <Zap className="w-8 h-8 text-neon-purple" />
              </motion.div>
              <motion.p
                className="text-white/70 text-lg"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {view === 'sign_in' ? 'Sign in to your neural network' : 'Create your digital consciousness'}
              </motion.p>
            </div>

            {/* Auth UI */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative z-10"
            >
              <Auth
                supabaseClient={supabase}
                appearance={{ 
                  theme: ThemeSupa,
                  variables: authTheme.default
                }}
                theme="dark"
                providers={['google', 'github']}
                redirectTo={`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/callback`}
                view={view}
                showLinks={true}
                magicLink={true}
              />
            </motion.div>

            {/* Features preview */}
            <motion.div
              className="mt-8 pt-6 border-t border-white/10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-center text-white/60 text-sm mb-4">Unlock revolutionary features:</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <Brain className="w-6 h-6 mx-auto text-neon-blue" />
                  <p className="text-xs text-white/70">AI Insights</p>
                </div>
                <div className="space-y-2">
                  <Zap className="w-6 h-6 mx-auto text-neon-purple" />
                  <p className="text-xs text-white/70">Habit DNA</p>
                </div>
                <div className="space-y-2">
                  <Sparkles className="w-6 h-6 mx-auto text-neon-pink" />
                  <p className="text-xs text-white/70">Time Travel</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}