"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Target, Zap, Calendar, TrendingUp, User, Brain, Atom, Clock, Dna } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { AuthModal } from "@/components/auth/AuthModal"
import { createClient } from "@/lib/auth"
import { useRouter } from "next/navigation"

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

const iconOptions = ["⭐", "🎯", "💪", "🧠", "❤️", "🌱", "📚", "💧", "🏃", "🧘"]
const colorOptions = ["#00f0ff", "#a855f7", "#f97316", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6", "#06b6d4"]

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    color: colorOptions[0],
    icon: iconOptions[0]
  })

  const router = useRouter()
  const supabase = createClient()
  const userId = user?.id || "demo-user-123"

  useEffect(() => {
    checkUser()
    fetchHabits()
    fetchHabitLogs()
  }, [])

  useEffect(() => {
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

  const fetchHabits = async () => {
    // For demo purposes, we'll use local storage since Supabase isn't configured
    const storedHabits = localStorage.getItem('habits')
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits))
    }
  }

  const fetchHabitLogs = async () => {
    const storedLogs = localStorage.getItem('habitLogs')
    if (storedLogs) {
      setHabitLogs(JSON.parse(storedLogs))
    }
  }

  const createHabit = async () => {
    if (!newHabit.name.trim()) return

    const habit: Habit = {
      id: crypto.randomUUID(),
      name: newHabit.name,
      description: newHabit.description || null,
      color: newHabit.color,
      icon: newHabit.icon,
      created_at: new Date().toISOString(),
      user_id: userId
    }

    const updatedHabits = [...habits, habit]
    setHabits(updatedHabits)
    localStorage.setItem('habits', JSON.stringify(updatedHabits))

    setNewHabit({ name: "", description: "", color: colorOptions[0], icon: iconOptions[0] })
    setShowCreateForm(false)
  }

  const logHabit = async (habitId: string) => {
    const log: HabitLog = {
      id: crypto.randomUUID(),
      habit_id: habitId,
      completed_at: new Date().toISOString(),
      notes: null
    }

    const updatedLogs = [...habitLogs, log]
    setHabitLogs(updatedLogs)
    localStorage.setItem('habitLogs', JSON.stringify(updatedLogs))
  }

  const getHabitStreak = (habitId: string) => {
    const logs = habitLogs
      .filter(log => log.habit_id === habitId)
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
    
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < logs.length; i++) {
      const logDate = new Date(logs[i].completed_at)
      const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === streak) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  const isCompletedToday = (habitId: string) => {
    const today = new Date().toDateString()
    return habitLogs.some(log => 
      log.habit_id === habitId && 
      new Date(log.completed_at).toDateString() === today
    )
  }

  return (
    <div className="min-h-screen p-6 space-y-8">
      {/* Top Navigation */}
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center space-x-3">
          <Button
            variant="neon"
            onClick={() => router.push('/mobile')}
            className="flex items-center space-x-2"
          >
            <Brain className="w-4 h-4" />
            <span>Mobile App</span>
          </Button>
          
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="flex items-center space-x-2"
          >
            <Target className="w-4 h-4" />
            <span>Desktop</span>
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 px-3 py-1 rounded-lg glass-dark border border-white/20">
                <User className="w-4 h-4 text-neon-blue" />
                <span className="text-white/90 text-sm">{user.email}</span>
              </div>
              <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="neon" onClick={() => setShowAuthModal(true)}>
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </motion.div>

      {/* Header */}
      <motion.div 
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent">
          Habit Nexus
        </h1>
        <p className="text-xl text-white/70">Transform your future, one habit at a time</p>
        
        {/* Revolutionary Features Showcase */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center space-x-6 text-sm text-white/60">
            <div className="flex items-center space-x-2">
              <Dna className="w-4 h-4 text-neon-blue" />
              <span>Habit DNA</span>
            </div>
            <div className="flex items-center space-x-2">
              <Atom className="w-4 h-4 text-neon-purple" />
              <span>Quantum States</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-neon-pink" />
              <span>Time Travel</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-neon-green" />
              <span>AI Insights</span>
            </div>
          </div>
        </div>
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-neon-blue rounded-full"
              animate={{
                x: [0, 100, 0],
                y: [0, -100, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + i * 10}%`
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card variant="neon" className="text-center">
          <CardContent className="pt-6">
            <Target className="w-8 h-8 mx-auto mb-2 text-neon-blue" />
            <div className="text-2xl font-bold text-white">{habits.length}</div>
            <p className="text-white/70">Active Habits</p>
          </CardContent>
        </Card>
        
        <Card variant="neon" className="text-center">
          <CardContent className="pt-6">
            <Zap className="w-8 h-8 mx-auto mb-2 text-neon-purple" />
            <div className="text-2xl font-bold text-white">{habitLogs.length}</div>
            <p className="text-white/70">Total Completions</p>
          </CardContent>
        </Card>
        
        <Card variant="neon" className="text-center">
          <CardContent className="pt-6">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-neon-pink" />
            <div className="text-2xl font-bold text-white">
              {habits.length > 0 ? Math.max(...habits.map(h => getHabitStreak(h.id))) : 0}
            </div>
            <p className="text-white/70">Best Streak</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Create Habit Button */}
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Button
          variant="neon"
          size="lg"
          onClick={() => setShowCreateForm(true)}
          className="space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Create New Habit</span>
        </Button>
      </motion.div>

      {/* Create Habit Form */}
      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCreateForm(false)}
          >
            <motion.div
              className="glass-dark p-6 rounded-xl border border-white/20 w-full max-w-md"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Create New Habit</h2>
              
              <div className="space-y-4">
                <Input
                  label="Habit Name"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  placeholder="Enter habit name..."
                />
                
                <Input
                  label="Description (Optional)"
                  value={newHabit.description}
                  onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  placeholder="Describe your habit..."
                />
                
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Icon</label>
                  <div className="grid grid-cols-5 gap-2">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        className={`p-2 rounded-lg border transition-all ${
                          newHabit.icon === icon 
                            ? 'border-neon-blue bg-neon-blue/20' 
                            : 'border-white/20 hover:border-white/40'
                        }`}
                        onClick={() => setNewHabit({ ...newHabit, icon })}
                      >
                        <span className="text-xl">{icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">Color</label>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          newHabit.color === color 
                            ? 'border-white scale-110' 
                            : 'border-white/20 hover:border-white/40'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewHabit({ ...newHabit, color })}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button variant="ghost" onClick={() => setShowCreateForm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button variant="neon" onClick={createHabit} className="flex-1">
                  Create Habit
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habits Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <AnimatePresence>
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card variant="glass" className="relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ backgroundColor: habit.color }}
                />
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{habit.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{habit.name}</CardTitle>
                        {habit.description && (
                          <p className="text-sm text-white/60 mt-1">{habit.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Streak</span>
                      <span className="text-white font-medium">{getHabitStreak(habit.id)} days</span>
                    </div>
                    
                    <Button
                      variant={isCompletedToday(habit.id) ? "secondary" : "primary"}
                      onClick={() => !isCompletedToday(habit.id) && logHabit(habit.id)}
                      disabled={isCompletedToday(habit.id)}
                      className="w-full"
                    >
                      {isCompletedToday(habit.id) ? "✓ Completed Today" : "Mark Complete"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {habits.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Calendar className="w-16 h-16 mx-auto mb-4 text-white/30" />
          <h3 className="text-xl font-semibold text-white/70 mb-2">No habits yet</h3>
          <p className="text-white/50">Create your first habit to get started on your journey!</p>
        </motion.div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  )
}