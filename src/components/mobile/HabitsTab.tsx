"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { 
  Plus, 
  Target, 
  Zap, 
  TrendingUp,
  Check,
  Flame,
  Calendar,
  MoreHorizontal
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

interface HabitsTabProps {
  onCreateHabit: () => void
  onDataChange?: () => void
}

export function HabitsTab({ onCreateHabit, onDataChange }: HabitsTabProps) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [habitLogs, setHabitLogs] = useState<HabitLog[]>([])

  useEffect(() => {
    loadHabits()
    loadHabitLogs()
  }, [])

  const loadHabits = () => {
    const stored = localStorage.getItem('habits')
    if (stored) {
      setHabits(JSON.parse(stored))
    } else {
      // Load demo data
      const demoHabits = [
        {
          id: 'demo-1',
          name: 'Morning Meditation',
          description: 'Start the day with mindfulness',
          color: '#00f0ff',
          icon: '🧘',
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          user_id: 'demo'
        },
        {
          id: 'demo-2',
          name: 'Daily Exercise',
          description: 'Keep the body strong',
          color: '#a855f7',
          icon: '💪',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          user_id: 'demo'
        },
        {
          id: 'demo-3',
          name: 'Read 30 Minutes',
          description: 'Expand knowledge daily',
          color: '#f97316',
          icon: '📚',
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          user_id: 'demo'
        }
      ]
      setHabits(demoHabits)
      localStorage.setItem('habits', JSON.stringify(demoHabits))
    }
  }

  const loadHabitLogs = () => {
    const stored = localStorage.getItem('habitLogs')
    if (stored) {
      setHabitLogs(JSON.parse(stored))
    } else {
      // Generate demo logs
      const demoLogs: HabitLog[] = []
      const habitIds = ['demo-1', 'demo-2', 'demo-3']
      
      habitIds.forEach(habitId => {
        for (let i = 0; i < 7; i++) {
          const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
          if (Math.random() > 0.3) { // 70% completion rate
            demoLogs.push({
              id: `${habitId}-${i}`,
              habit_id: habitId,
              completed_at: date.toISOString(),
              notes: null
            })
          }
        }
      })
      
      setHabitLogs(demoLogs)
      localStorage.setItem('habitLogs', JSON.stringify(demoLogs))
    }
  }

  const isCompletedToday = (habitId: string) => {
    const today = new Date().toDateString()
    return habitLogs.some(log => 
      log.habit_id === habitId && 
      new Date(log.completed_at).toDateString() === today
    )
  }

  const getStreak = (habitId: string) => {
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

  const completeHabit = (habitId: string) => {
    const newLog: HabitLog = {
      id: crypto.randomUUID(),
      habit_id: habitId,
      completed_at: new Date().toISOString(),
      notes: null
    }
    
    const updatedLogs = [...habitLogs, newLog]
    setHabitLogs(updatedLogs)
    localStorage.setItem('habitLogs', JSON.stringify(updatedLogs))
    
    // Trigger data refresh in parent
    onDataChange?.()
  }

  const getTodayStats = () => {
    const completed = habits.filter(h => isCompletedToday(h.id)).length
    const total = habits.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return { completed, total, percentage }
  }

  const stats = getTodayStats()

  return (
    <div className="p-4 space-y-6">
      {/* Today's Progress */}
      <Card variant="neon" className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">Today's Progress</h2>
              <p className="text-white/70 text-sm">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <motion.div
              className="relative w-16 h-16"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                  fill="none"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#00f0ff"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: stats.percentage / 100 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{
                    pathLength: stats.percentage / 100,
                    strokeDasharray: "176",
                    strokeDashoffset: 176 * (1 - stats.percentage / 100)
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-sm">{stats.percentage}%</span>
              </div>
            </motion.div>
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-white/80">{stats.completed} completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-white/60" />
              <span className="text-white/60">{stats.total} total</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card variant="glass" className="text-center">
          <CardContent className="p-4">
            <Flame className="w-6 h-6 mx-auto mb-2 text-neon-blue" />
            <div className="text-lg font-bold text-white">
              {Math.max(...habits.map(h => getStreak(h.id)), 0)}
            </div>
            <p className="text-white/70 text-xs">Best Streak</p>
          </CardContent>
        </Card>
        
        <Card variant="glass" className="text-center">
          <CardContent className="p-4">
            <Zap className="w-6 h-6 mx-auto mb-2 text-neon-purple" />
            <div className="text-lg font-bold text-white">{habitLogs.length}</div>
            <p className="text-white/70 text-xs">Total Logs</p>
          </CardContent>
        </Card>
        
        <Card variant="glass" className="text-center">
          <CardContent className="p-4">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-neon-pink" />
            <div className="text-lg font-bold text-white">{habits.length}</div>
            <p className="text-white/70 text-xs">Active Habits</p>
          </CardContent>
        </Card>
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Your Habits</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCreateHabit}
            className="text-neon-blue"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {habits.map((habit, index) => {
              const completed = isCompletedToday(habit.id)
              const streak = getStreak(habit.id)
              
              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card variant="glass" className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                          style={{ backgroundColor: `${habit.color}20`, border: `1px solid ${habit.color}40` }}
                        >
                          {habit.icon}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-white truncate">{habit.name}</h4>
                          <div className="flex items-center space-x-3 mt-1">
                            {streak > 0 && (
                              <div className="flex items-center space-x-1">
                                <Flame className="w-3 h-3 text-orange-400" />
                                <span className="text-xs text-white/70">{streak} day{streak !== 1 ? 's' : ''}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3 text-white/50" />
                              <span className="text-xs text-white/50">
                                {Math.floor((new Date().getTime() - new Date(habit.created_at).getTime()) / (1000 * 60 * 60 * 24))} days ago
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => !completed && completeHabit(habit.id)}
                            disabled={completed}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                              completed
                                ? 'bg-green-500/20 border border-green-500/40'
                                : 'bg-white/10 border border-white/20 hover:border-white/40'
                            }`}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Check 
                              className={`w-5 h-5 transition-colors ${
                                completed ? 'text-green-400' : 'text-white/60'
                              }`}
                            />
                          </motion.button>
                          
                          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                            <MoreHorizontal className="w-4 h-4 text-white/60" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {habits.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Target className="w-16 h-16 mx-auto mb-4 text-white/30" />
            <h3 className="text-lg font-semibold text-white/70 mb-2">No habits yet</h3>
            <p className="text-white/50 mb-6">Start building better habits today!</p>
            <Button variant="neon" onClick={onCreateHabit}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Habit
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}