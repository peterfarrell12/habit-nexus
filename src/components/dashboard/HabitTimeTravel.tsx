"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { 
  Clock, 
  Rewind, 
  FastForward, 
  Play, 
  Pause, 
  RotateCcw, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  Sparkles
} from "lucide-react"
import { format, addDays, subDays, startOfDay, endOfDay } from "date-fns"

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

interface TimelineEvent {
  date: Date
  type: 'past' | 'present' | 'future'
  habits: Array<{
    habit: Habit
    completed: boolean
    probability?: number
    streak?: number
    impact?: 'positive' | 'negative' | 'neutral'
  }>
  insights?: string[]
}

interface HabitTimeTravelProps {
  habits: Habit[]
  habitLogs: HabitLog[]
}

export function HabitTimeTravel({ habits, habitLogs }: HabitTimeTravelProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [timelineMode, setTimelineMode] = useState<'day' | 'week' | 'month'>('day')
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [selectedTimeline, setSelectedTimeline] = useState<'past' | 'future'>('future')

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentDate(prev => {
          const increment = timelineMode === 'day' ? 1 : timelineMode === 'week' ? 7 : 30
          return selectedTimeline === 'future' 
            ? addDays(prev, increment)
            : subDays(prev, increment)
        })
      }, 1000 / playbackSpeed)
    }

    return () => clearInterval(interval)
  }, [isPlaying, playbackSpeed, timelineMode, selectedTimeline])

  const generateTimelineEvents = (targetDate: Date): TimelineEvent => {
    const isToday = targetDate.toDateString() === new Date().toDateString()
    const isPast = targetDate < new Date()
    const type = isToday ? 'present' : isPast ? 'past' : 'future'

    const habitStates = habits.map(habit => {
      if (type === 'past') {
        // Look up actual historical data
        const completed = habitLogs.some(log => 
          log.habit_id === habit.id &&
          new Date(log.completed_at).toDateString() === targetDate.toDateString()
        )
        
        const streak = calculateStreak(habit.id, targetDate)
        
        return {
          habit,
          completed,
          streak,
          impact: completed ? 'positive' as const : 'negative' as const
        }
      } else {
        // Predict future states using AI-like algorithms
        const probability = predictHabitProbability(habit, targetDate)
        const completed = probability > 0.5
        const streak = calculateProjectedStreak(habit.id, targetDate)
        
        return {
          habit,
          completed,
          probability,
          streak,
          impact: probability > 0.7 ? 'positive' as const : 
                 probability < 0.3 ? 'negative' as const : 'neutral' as const
        }
      }
    })

    const insights = generateInsights(habitStates, type, targetDate)

    return {
      date: targetDate,
      type,
      habits: habitStates,
      insights
    }
  }

  const predictHabitProbability = (habit: Habit, targetDate: Date): number => {
    // Advanced prediction algorithm considering multiple factors
    const historicalLogs = habitLogs.filter(log => log.habit_id === habit.id)
    
    if (historicalLogs.length === 0) return 0.5
    
    // Factor 1: Historical completion rate
    const totalDays = Math.max(1, Math.floor((new Date().getTime() - new Date(habit.created_at).getTime()) / (1000 * 60 * 60 * 24)))
    const baseRate = historicalLogs.length / totalDays
    
    // Factor 2: Day of week pattern
    const dayOfWeek = targetDate.getDay()
    const dayPattern = historicalLogs.filter(log => new Date(log.completed_at).getDay() === dayOfWeek).length
    const dayFactor = dayPattern / Math.max(1, Math.floor(historicalLogs.length / 7))
    
    // Factor 3: Time distance decay (habits become harder to maintain over time)
    const daysFromNow = Math.floor((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    const decayFactor = Math.exp(-daysFromNow * 0.01) // Exponential decay
    
    // Factor 4: Streak momentum
    const currentStreak = calculateStreak(habit.id, new Date())
    const momentumFactor = Math.min(1.5, 1 + currentStreak * 0.02)
    
    // Factor 5: Seasonal/cyclical patterns
    const month = targetDate.getMonth()
    const seasonalPattern = 0.8 + 0.4 * Math.sin((month / 12) * 2 * Math.PI) // Peak in summer
    
    const probability = Math.max(0.1, Math.min(0.9, 
      baseRate * dayFactor * decayFactor * momentumFactor * seasonalPattern
    ))
    
    return probability
  }

  const calculateStreak = (habitId: string, endDate: Date): number => {
    const logs = habitLogs
      .filter(log => log.habit_id === habitId)
      .filter(log => new Date(log.completed_at) <= endDate)
      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
    
    let streak = 0
    let currentDate = new Date(endDate)
    
    for (const log of logs) {
      const logDate = new Date(log.completed_at)
      const daysDiff = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === streak) {
        streak++
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000)
      } else {
        break
      }
    }
    
    return streak
  }

  const calculateProjectedStreak = (habitId: string, targetDate: Date): number => {
    const currentStreak = calculateStreak(habitId, new Date())
    const daysFromNow = Math.floor((targetDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    
    // Simulate streak growth/decline based on probability
    let projectedStreak = currentStreak
    for (let i = 1; i <= daysFromNow; i++) {
      const dayDate = addDays(new Date(), i)
      const habit = habits.find(h => h.id === habitId)!
      const probability = predictHabitProbability(habit, dayDate)
      
      if (probability > 0.5) {
        projectedStreak++
      } else {
        projectedStreak = 0
        break
      }
    }
    
    return projectedStreak
  }

  const generateInsights = (habitStates: any[], type: string, date: Date): string[] => {
    const insights: string[] = []
    
    if (type === 'future') {
      const highProbHabits = habitStates.filter(h => h.probability && h.probability > 0.8)
      const lowProbHabits = habitStates.filter(h => h.probability && h.probability < 0.3)
      const longStreaks = habitStates.filter(h => h.streak && h.streak > 7)
      
      if (highProbHabits.length > 0) {
        insights.push(`🌟 Strong momentum: ${highProbHabits.map(h => h.habit.name).join(', ')}`)
      }
      
      if (lowProbHabits.length > 0) {
        insights.push(`⚠️ At risk: ${lowProbHabits.map(h => h.habit.name).join(', ')}`)
      }
      
      if (longStreaks.length > 0) {
        insights.push(`🔥 Epic streaks projected: ${longStreaks.map(h => `${h.habit.name} (${h.streak} days)`).join(', ')}`)
      }
      
      const daysFromNow = Math.floor((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      if (daysFromNow > 30) {
        insights.push(`🚀 Long-term vision: You're building a completely new version of yourself`)
      } else if (daysFromNow > 7) {
        insights.push(`📈 Medium-term growth: Significant progress visible in your habits`)
      }
    } else if (type === 'past') {
      const completedCount = habitStates.filter(h => h.completed).length
      const totalCount = habitStates.length
      const completionRate = totalCount > 0 ? completedCount / totalCount : 0
      
      if (completionRate > 0.8) {
        insights.push(`✨ Legendary day: ${completedCount}/${totalCount} habits completed!`)
      } else if (completionRate > 0.5) {
        insights.push(`👍 Solid performance: ${completedCount}/${totalCount} habits completed`)
      } else {
        insights.push(`💪 Learning opportunity: Room for growth on this day`)
      }
    }
    
    return insights
  }

  const jumpToDate = (direction: 'past' | 'future', amount: number) => {
    setCurrentDate(prev => 
      direction === 'future' ? addDays(prev, amount) : subDays(prev, amount)
    )
  }

  const resetToToday = () => {
    setCurrentDate(new Date())
    setIsPlaying(false)
  }

  const timelineEvent = generateTimelineEvents(currentDate)
  const isToday = currentDate.toDateString() === new Date().toDateString()

  return (
    <Card variant="neon" className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20">
              <Clock className="w-6 h-6 text-neon-blue" />
            </div>
            <div>
              <CardTitle className="text-xl">Habit Time Travel</CardTitle>
              <p className="text-white/70 text-sm">Journey through your habit timeline</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant={selectedTimeline === 'past' ? 'neon' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTimeline('past')}
            >
              Past
            </Button>
            <Button
              variant={selectedTimeline === 'future' ? 'neon' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTimeline('future')}
            >
              Future
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Time Controls */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-black/20 border border-white/10">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => jumpToDate('past', timelineMode === 'day' ? 1 : timelineMode === 'week' ? 7 : 30)}
              >
                <Rewind className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => jumpToDate('future', timelineMode === 'day' ? 1 : timelineMode === 'week' ? 7 : 30)}
              >
                <FastForward className="w-4 h-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={resetToToday}
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-white/70 text-sm">Speed:</span>
              {[0.5, 1, 2, 4].map(speed => (
                <Button
                  key={speed}
                  variant={playbackSpeed === speed ? 'neon' : 'ghost'}
                  size="sm"
                  onClick={() => setPlaybackSpeed(speed)}
                  className="text-xs px-2"
                >
                  {speed}x
                </Button>
              ))}
            </div>
          </div>

          {/* Current Date Display */}
          <div className="text-center">
            <motion.div
              className="inline-flex items-center space-x-3 p-4 rounded-lg glass-dark border border-white/20"
              animate={{ scale: isToday ? [1, 1.05, 1] : 1 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Calendar className="w-6 h-6 text-neon-blue" />
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {format(currentDate, 'EEEE, MMMM d, yyyy')}
                </h3>
                <p className="text-white/60 text-sm">
                  {timelineEvent.type === 'past' ? 'Historical Data' : 
                   timelineEvent.type === 'present' ? 'Today' : 
                   'Predicted Timeline'}
                </p>
              </div>
              {isToday && <Sparkles className="w-6 h-6 text-neon-purple animate-pulse" />}
            </motion.div>
          </div>

          {/* Timeline Visualization */}
          <div className="relative">
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-8 relative">
                {/* Past */}
                <motion.div
                  className={`flex items-center space-x-2 ${timelineEvent.type === 'past' ? 'text-neon-blue' : 'text-white/40'}`}
                  animate={{ scale: timelineEvent.type === 'past' ? 1.1 : 1 }}
                >
                  <div className="w-3 h-3 rounded-full bg-neon-blue opacity-60" />
                  <span className="text-sm">Past</span>
                </motion.div>
                
                {/* Timeline line */}
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink opacity-30" />
                
                {/* Present */}
                <motion.div
                  className={`flex items-center space-x-2 relative z-10 ${timelineEvent.type === 'present' ? 'text-neon-purple' : 'text-white/40'}`}
                  animate={{ scale: timelineEvent.type === 'present' ? 1.1 : 1 }}
                >
                  <div className="w-4 h-4 rounded-full bg-neon-purple" />
                  <span className="text-sm font-medium">Present</span>
                </motion.div>
                
                {/* Future */}
                <motion.div
                  className={`flex items-center space-x-2 ${timelineEvent.type === 'future' ? 'text-neon-pink' : 'text-white/40'}`}
                  animate={{ scale: timelineEvent.type === 'future' ? 1.1 : 1 }}
                >
                  <div className="w-3 h-3 rounded-full bg-neon-pink opacity-60" />
                  <span className="text-sm">Future</span>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Habit States */}
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {timelineEvent.habits.map((habitState, index) => (
                <motion.div
                  key={`${habitState.habit.id}-${currentDate.toISOString()}`}
                  className="p-4 rounded-lg border border-white/10 bg-gradient-to-r from-black/20 to-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <motion.span
                        className="text-2xl"
                        animate={{ 
                          filter: habitState.completed ? 'brightness(1.5)' : 'brightness(0.7)',
                          scale: habitState.completed ? [1, 1.2, 1] : 1
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        {habitState.habit.icon}
                      </motion.span>
                      <div>
                        <h4 className="text-white font-medium">{habitState.habit.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-white/60">
                          {habitState.streak && (
                            <span className="flex items-center space-x-1">
                              <TrendingUp className="w-3 h-3" />
                              <span>{habitState.streak} day streak</span>
                            </span>
                          )}
                          {habitState.probability !== undefined && (
                            <span className="text-white/50">
                              {(habitState.probability * 100).toFixed(0)}% probability
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {habitState.impact === 'positive' && (
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      )}
                      {habitState.impact === 'negative' && (
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                      )}
                      {habitState.impact === 'neutral' && (
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                      )}
                      
                      <span className={`text-sm font-medium ${
                        habitState.completed ? 'text-green-400' : 'text-white/50'
                      }`}>
                        {habitState.completed ? '✓ Completed' : '○ Not Done'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Insights */}
          {timelineEvent.insights && timelineEvent.insights.length > 0 && (
            <div className="p-4 rounded-lg bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border border-white/10">
              <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-neon-blue" />
                <span>Timeline Insights</span>
              </h4>
              <div className="space-y-1">
                {timelineEvent.insights.map((insight, index) => (
                  <motion.p
                    key={index}
                    className="text-white/80 text-sm"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    {insight}
                  </motion.p>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}