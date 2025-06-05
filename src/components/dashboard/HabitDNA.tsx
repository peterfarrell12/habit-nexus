"use client"

import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Dna, Zap, Target, TrendingUp, Brain, Heart } from "lucide-react"

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

interface HabitDNAProps {
  habits: Habit[]
  habitLogs: HabitLog[]
}

interface DNATrait {
  name: string
  value: number
  color: string
  icon: React.ReactNode
  description: string
}

export function HabitDNA({ habits, habitLogs }: HabitDNAProps) {
  const calculateDNATraits = (): DNATrait[] => {
    const totalLogs = habitLogs.length
    const uniqueHabits = habits.length
    
    // Calculate consistency score
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toDateString()
    })
    
    const recentLogs = habitLogs.filter(log => 
      last7Days.includes(new Date(log.completed_at).toDateString())
    )
    
    const consistency = uniqueHabits > 0 ? (recentLogs.length / (uniqueHabits * 7)) * 100 : 0
    
    // Calculate momentum (trending up/down)
    const lastWeekLogs = habitLogs.filter(log => {
      const logDate = new Date(log.completed_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return logDate >= weekAgo
    }).length
    
    const previousWeekLogs = habitLogs.filter(log => {
      const logDate = new Date(log.completed_at)
      const twoWeeksAgo = new Date()
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return logDate >= twoWeeksAgo && logDate < weekAgo
    }).length
    
    const momentum = previousWeekLogs > 0 ? ((lastWeekLogs - previousWeekLogs) / previousWeekLogs) * 100 + 50 : 50
    
    // Calculate focus (variety vs specialization)
    const habitCompletions = habits.map(habit => 
      habitLogs.filter(log => log.habit_id === habit.id).length
    )
    const maxCompletions = Math.max(...habitCompletions, 1)
    const avgCompletions = habitCompletions.reduce((a, b) => a + b, 0) / habitCompletions.length || 0
    const focus = (avgCompletions / maxCompletions) * 100
    
    // Calculate resilience (bounce back from gaps)
    const gaps = calculateGaps()
    const resilience = Math.max(0, 100 - gaps * 10)
    
    // Calculate balance (variety of habit types)
    const habitIcons = habits.map(h => h.icon)
    const uniqueIcons = new Set(habitIcons).size
    const balance = uniqueHabits > 0 ? (uniqueIcons / uniqueHabits) * 100 : 0
    
    // Calculate evolution (adaptation over time)
    const oldestHabit = habits.reduce((oldest, habit) => 
      new Date(habit.created_at) < new Date(oldest.created_at) ? habit : oldest
    , habits[0] || { created_at: new Date().toISOString() })
    
    const daysSinceFirst = oldestHabit ? 
      (new Date().getTime() - new Date(oldestHabit.created_at).getTime()) / (1000 * 60 * 60 * 24) : 0
    
    const evolution = Math.min(100, (daysSinceFirst / 30) * 20 + (uniqueHabits * 10))
    
    return [
      {
        name: "Consistency",
        value: Math.round(consistency),
        color: "#00f0ff",
        icon: <Target className="w-4 h-4" />,
        description: "How regularly you complete your habits"
      },
      {
        name: "Momentum",
        value: Math.round(Math.max(0, Math.min(100, momentum))),
        color: "#a855f7",
        icon: <TrendingUp className="w-4 h-4" />,
        description: "Your current growth trajectory"
      },
      {
        name: "Focus",
        value: Math.round(focus),
        color: "#f97316",
        icon: <Brain className="w-4 h-4" />,
        description: "Balance between specialization and variety"
      },
      {
        name: "Resilience",
        value: Math.round(resilience),
        color: "#10b981",
        icon: <Heart className="w-4 h-4" />,
        description: "Ability to recover from setbacks"
      },
      {
        name: "Balance",
        value: Math.round(balance),
        color: "#f59e0b",
        icon: <Zap className="w-4 h-4" />,
        description: "Diversity of habit categories"
      },
      {
        name: "Evolution",
        value: Math.round(evolution),
        color: "#8b5cf6",
        icon: <Dna className="w-4 h-4" />,
        description: "Growth and adaptation over time"
      }
    ]
  }
  
  const calculateGaps = (): number => {
    if (habits.length === 0) return 0
    
    let gaps = 0
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toDateString()
    })
    
    last30Days.forEach(day => {
      const dayLogs = habitLogs.filter(log => 
        new Date(log.completed_at).toDateString() === day
      )
      if (dayLogs.length === 0) gaps++
    })
    
    return gaps
  }
  
  const traits = calculateDNATraits()
  
  const getGeneticCode = (): string => {
    return traits.map(trait => {
      if (trait.value >= 80) return 'A'
      if (trait.value >= 60) return 'B' 
      if (trait.value >= 40) return 'C'
      if (trait.value >= 20) return 'D'
      return 'E'
    }).join('')
  }
  
  return (
    <Card variant="neon" className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20">
            <Dna className="w-6 h-6 text-neon-blue" />
          </div>
          <div>
            <CardTitle className="text-xl">Habit DNA</CardTitle>
            <p className="text-white/70 text-sm">Your behavioral genetic profile</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Genetic Code */}
          <div className="text-center">
            <p className="text-white/60 text-sm mb-2">Genetic Code</p>
            <div className="font-mono text-2xl text-neon-blue tracking-widest">
              {getGeneticCode()}
            </div>
          </div>
          
          {/* DNA Traits */}
          <div className="space-y-4">
            {traits.map((trait, index) => (
              <motion.div
                key={trait.name}
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div style={{ color: trait.color }}>
                      {trait.icon}
                    </div>
                    <span className="text-white/90 font-medium">{trait.name}</span>
                  </div>
                  <span className="text-white/70 text-sm">{trait.value}%</span>
                </div>
                
                <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{ 
                      background: `linear-gradient(90deg, ${trait.color}40, ${trait.color})`,
                      boxShadow: `0 0 10px ${trait.color}40`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${trait.value}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  />
                  
                  {/* Animated glow effect */}
                  <motion.div
                    className="absolute top-0 left-0 h-full w-8 rounded-full opacity-60"
                    style={{ 
                      background: `linear-gradient(90deg, transparent, ${trait.color}, transparent)`,
                      filter: 'blur(4px)'
                    }}
                    animate={{ x: [-32, trait.value * 3, -32] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: index * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                </div>
                
                <p className="text-white/50 text-xs">{trait.description}</p>
              </motion.div>
            ))}
          </div>
          
          {/* DNA Helix Animation */}
          <div className="flex justify-center mt-8">
            <div className="relative w-24 h-32">
              <svg viewBox="0 0 100 120" className="w-full h-full">
                <defs>
                  <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor:'#00f0ff', stopOpacity:1}} />
                    <stop offset="50%" style={{stopColor:'#a855f7', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#f97316', stopOpacity:1}} />
                  </linearGradient>
                </defs>
                
                {/* DNA Strands */}
                <motion.path
                  d="M20 10 Q50 30 80 50 Q50 70 20 90 Q50 110 80 130"
                  stroke="url(#dnaGradient)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.path
                  d="M80 10 Q50 30 20 50 Q50 70 80 90 Q50 110 20 130"
                  stroke="url(#dnaGradient)"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                />
                
                {/* DNA Base Pairs */}
                {[...Array(6)].map((_, i) => (
                  <motion.line
                    key={i}
                    x1="20"
                    y1={20 + i * 16}
                    x2="80"
                    y2={20 + i * 16}
                    stroke="rgba(0, 240, 255, 0.3)"
                    strokeWidth="1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </svg>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}