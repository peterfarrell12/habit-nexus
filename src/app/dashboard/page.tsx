"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/auth"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { HabitDNA } from "@/components/dashboard/HabitDNA"
import { QuantumHabitStates } from "@/components/dashboard/QuantumHabitStates"
import { HabitTimeTravel } from "@/components/dashboard/HabitTimeTravel"
import { AdvancedAnalytics } from "@/components/dashboard/AdvancedAnalytics"
import { 
  BarChart3, 
  Dna, 
  Atom, 
  Clock, 
  Brain,
  User,
  LogOut,
  Sparkles,
  Zap,
  TrendingUp
} from "lucide-react"

interface Habit {
  id: string
  name: string
  description: string | null
  color: string
  icon: string
  created_at: string
  user_id: string
}

interface HabitLog {
  id: string
  habit_id: string
  completed_at: string
  notes: string | null
}

type DashboardView = 'overview' | 'analytics' | 'dna' | 'quantum' | 'timetravel'

export default function Dashboard() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([])
  const [user, setUser] = useState<any>(null)
  const [currentView, setCurrentView] = useState<DashboardView>('overview')
  const [loading, setLoading] = useState(true)
  
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    loadData()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (!user) {
        // Redirect to login or use demo data
        loadDemoData()
      }
    } catch (error) {
      console.error('Error checking user:', error)
      loadDemoData()
    } finally {
      setLoading(false)
    }
  }

  const loadData = async () => {
    try {
      // For now, use localStorage data
      const storedHabits = localStorage.getItem('habits')
      const storedLogs = localStorage.getItem('habitLogs')
      
      if (storedHabits) setHabits(JSON.parse(storedHabits))
      if (storedLogs) setHabitLogs(JSON.parse(storedLogs))
    } catch (error) {
      console.error('Error loading data:', error)
    }
  }

  const loadDemoData = () => {
    // Create demo data for showcase
    const demoHabits: Habit[] = [
      {
        id: 'demo-1',
        name: 'Neural Enhancement',
        description: 'Daily brain training exercises',
        color: '#00f0ff',
        icon: '🧠',
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: 'demo-user'
      },
      {
        id: 'demo-2',
        name: 'Quantum Meditation',
        description: 'Consciousness expansion sessions',
        color: '#a855f7',
        icon: '🧘',
        created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: 'demo-user'
      },
      {
        id: 'demo-3',
        name: 'Biometric Optimization',
        description: 'Physical performance tracking',
        color: '#f97316',
        icon: '💪',
        created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: 'demo-user'
      },
      {
        id: 'demo-4',
        name: 'Energy Synthesis',
        description: 'Metabolic enhancement protocol',
        color: '#10b981',
        icon: '⚡',
        created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: 'demo-user'
      }
    ]

    const demoLogs: HabitLog[] = []
    
    // Generate realistic demo logs
    demoHabits.forEach(habit => {
      for (let i = 0; i < 30; i++) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        const probability = Math.random()
        
        // Create realistic patterns
        const dayOfWeek = date.getDay()
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
        const baseChance = isWeekend ? 0.6 : 0.8
        
        if (probability < baseChance) {
          demoLogs.push({
            id: `demo-log-${habit.id}-${i}`,
            habit_id: habit.id,
            completed_at: date.toISOString(),
            notes: null
          })
        }
      }
    })

    setHabits(demoHabits)
    setHabitLogs(demoLogs)
    
    // Store demo data
    localStorage.setItem('habits', JSON.stringify(demoHabits))
    localStorage.setItem('habitLogs', JSON.stringify(demoLogs))
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
  }

  const handleQuantumMeasurement = (habitId: string, state: 'completed' | 'collapsed') => {
    if (state === 'completed') {
      const newLog: HabitLog = {
        id: crypto.randomUUID(),
        habit_id: habitId,
        completed_at: new Date().toISOString(),
        notes: 'Quantum measurement result'
      }
      
      const updatedLogs = [...habitLogs, newLog]
      setHabitLogs(updatedLogs)
      localStorage.setItem('habitLogs', JSON.stringify(updatedLogs))
    }
  }

  const navigationItems = [
    { id: 'overview', label: 'Neural Command Center', icon: Brain },
    { id: 'analytics', label: 'Data Nexus', icon: BarChart3 },
    { id: 'dna', label: 'Habit DNA', icon: Dna },
    { id: 'quantum', label: 'Quantum States', icon: Atom },
    { id: 'timetravel', label: 'Time Travel', icon: Clock }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-neon-blue border-t-transparent rounded-full mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-white/70">Initializing neural networks...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyber-darker via-cyber-dark to-cyber-light">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-cyber-grid opacity-5 animate-pulse" style={{ backgroundSize: '50px 50px' }} />
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-blue rounded-full"
            animate={{
              x: [0, window.innerWidth || 1920],
              y: [Math.random() * (window.innerHeight || 1080), Math.random() * (window.innerHeight || 1080)],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear"
            }}
            style={{
              left: Math.random() * -100,
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="p-6 border-b border-white/10 glass-dark">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20">
                <Sparkles className="w-8 h-8 text-neon-blue" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
                  Habit Nexus Dashboard
                </h1>
                <p className="text-white/70">Advanced behavioral analysis system</p>
              </div>
            </motion.div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-1 rounded-lg glass-dark border border-white/20">
                    <User className="w-4 h-4 text-neon-blue" />
                    <span className="text-white/90 text-sm">{user.email || 'Neural User'}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleSignOut}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="px-3 py-1 rounded-lg glass-dark border border-white/20">
                  <span className="text-white/70 text-sm">Demo Mode</span>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="p-6 border-b border-white/10">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {navigationItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  variant={currentView === item.id ? 'neon' : 'ghost'}
                  onClick={() => setCurrentView(item.id as DashboardView)}
                  className="flex items-center space-x-2 whitespace-nowrap"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              </motion.div>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="p-6">
          <AnimatePresence mode="wait">
            {currentView === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card variant="neon" className="text-center">
                    <CardContent className="pt-6">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 text-neon-blue" />
                      <div className="text-2xl font-bold text-white">{habits.length}</div>
                      <p className="text-white/70">Active Protocols</p>
                    </CardContent>
                  </Card>
                  
                  <Card variant="neon" className="text-center">
                    <CardContent className="pt-6">
                      <Zap className="w-8 h-8 mx-auto mb-2 text-neon-purple" />
                      <div className="text-2xl font-bold text-white">{habitLogs.length}</div>
                      <p className="text-white/70">Neural Activations</p>
                    </CardContent>
                  </Card>
                  
                  <Card variant="neon" className="text-center">
                    <CardContent className="pt-6">
                      <Brain className="w-8 h-8 mx-auto mb-2 text-neon-pink" />
                      <div className="text-2xl font-bold text-white">
                        {habits.length > 0 ? Math.round(habitLogs.length / habits.length * 10) / 10 : 0}
                      </div>
                      <p className="text-white/70">Avg Completion</p>
                    </CardContent>
                  </Card>
                  
                  <Card variant="neon" className="text-center">
                    <CardContent className="pt-6">
                      <Sparkles className="w-8 h-8 mx-auto mb-2 text-neon-green" />
                      <div className="text-2xl font-bold text-white">A+</div>
                      <p className="text-white/70">Neural Grade</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Mini Feature Preview */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <HabitDNA habits={habits} habitLogs={habitLogs} />
                  <QuantumHabitStates 
                    habits={habits} 
                    habitLogs={habitLogs} 
                    onQuantumMeasurement={handleQuantumMeasurement}
                  />
                </div>
              </motion.div>
            )}

            {currentView === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AdvancedAnalytics habits={habits} habitLogs={habitLogs} />
              </motion.div>
            )}

            {currentView === 'dna' && (
              <motion.div
                key="dna"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <HabitDNA habits={habits} habitLogs={habitLogs} />
              </motion.div>
            )}

            {currentView === 'quantum' && (
              <motion.div
                key="quantum"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <QuantumHabitStates 
                  habits={habits} 
                  habitLogs={habitLogs} 
                  onQuantumMeasurement={handleQuantumMeasurement}
                />
              </motion.div>
            )}

            {currentView === 'timetravel' && (
              <motion.div
                key="timetravel"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <HabitTimeTravel habits={habits} habitLogs={habitLogs} />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}