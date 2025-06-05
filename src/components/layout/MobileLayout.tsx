"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/auth"
import { 
  Home, 
  BarChart3, 
  User, 
  Plus,
  Target,
  Brain,
  Atom,
  Clock
} from "lucide-react"

interface MobileLayoutProps {
  children: React.ReactNode
  currentTab: 'habits' | 'dashboard' | 'profile'
  onTabChange: (tab: 'habits' | 'dashboard' | 'profile') => void
  onShowAuth: () => void
}

export function MobileLayout({ children, currentTab, onTabChange, onShowAuth }: MobileLayoutProps) {
  const [user, setUser] = useState<any>(null)
  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    }
  }

  const tabItems = [
    {
      id: 'habits' as const,
      label: 'Habits',
      icon: Home,
      color: '#00f0ff'
    },
    {
      id: 'dashboard' as const,
      label: 'Analytics',
      icon: BarChart3,
      color: '#a855f7'
    },
    {
      id: 'profile' as const,
      label: 'Profile',
      icon: User,
      color: '#f97316'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-light overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-cyber-grid opacity-5" style={{ backgroundSize: '30px 30px' }} />
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-neon-blue rounded-full"
            animate={{
              x: [0, typeof window !== 'undefined' ? window.innerWidth : 400],
              y: [
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800), 
                Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
              ],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 glass-dark border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              className="p-2 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20"
              whileTap={{ scale: 0.95 }}
            >
              <Brain className="w-6 h-6 text-neon-blue" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent">
                Habit Nexus
              </h1>
              <p className="text-xs text-white/60">
                {tabItems.find(t => t.id === currentTab)?.label}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </div>
            ) : (
              <motion.button
                onClick={onShowAuth}
                className="px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg"
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pb-20 min-h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      {currentTab === 'habits' && (
        <motion.button
          className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full shadow-neon flex items-center justify-center z-20"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setShowQuickAdd(true)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <Plus className="w-6 h-6 text-white" />
        </motion.button>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 glass-dark border-t border-white/10 safe-area-pb">
        <div className="flex items-center justify-around py-2">
          {tabItems.map((tab) => {
            const isActive = currentTab === tab.id
            const Icon = tab.icon
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center space-y-1 p-2 min-w-[60px]"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    isActive 
                      ? 'bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border border-white/20' 
                      : 'bg-transparent'
                  }`}
                  animate={{ 
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isActive ? 'rgba(0, 240, 255, 0.1)' : 'transparent'
                  }}
                >
                  <Icon 
                    className={`w-5 h-5 transition-colors duration-300 ${
                      isActive ? 'text-neon-blue' : 'text-white/60'
                    }`}
                  />
                </motion.div>
                <span 
                  className={`text-xs font-medium transition-colors duration-300 ${
                    isActive ? 'text-white' : 'text-white/60'
                  }`}
                >
                  {tab.label}
                </span>
                
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="w-1 h-1 bg-neon-blue rounded-full"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            )
          })}
        </div>
      </nav>

      {/* Quick Add Modal */}
      <AnimatePresence>
        {showQuickAdd && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQuickAdd(false)}
          >
            <motion.div
              className="w-full max-w-md bg-gradient-to-br from-cyber-dark to-cyber-light rounded-t-2xl p-6 glass-dark border-t border-white/20"
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mb-6" />
              
              <h3 className="text-xl font-bold text-white mb-6 text-center">
                Quick Add Habit
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🧠', label: 'Meditation', color: '#00f0ff' },
                  { icon: '💪', label: 'Exercise', color: '#a855f7' },
                  { icon: '📚', label: 'Reading', color: '#f97316' },
                  { icon: '💧', label: 'Water', color: '#10b981' }
                ].map((preset) => (
                  <motion.button
                    key={preset.label}
                    className="p-4 rounded-xl glass border border-white/20 text-center"
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      // Add quick habit logic here
                      setShowQuickAdd(false)
                    }}
                  >
                    <div className="text-2xl mb-2">{preset.icon}</div>
                    <div className="text-sm text-white/90">{preset.label}</div>
                  </motion.button>
                ))}
              </div>
              
              <motion.button
                className="w-full mt-6 py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl text-white font-medium"
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowQuickAdd(false)}
              >
                Custom Habit
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}