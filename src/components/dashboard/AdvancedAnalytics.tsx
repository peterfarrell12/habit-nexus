"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Activity,
  Brain,
  Zap,
  Target,
  Calendar
} from "lucide-react"
import { format, subDays, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns"

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

interface AdvancedAnalyticsProps {
  habits: Habit[]
  habitLogs: HabitLog[]
}

export function AdvancedAnalytics({ habits, habitLogs }: AdvancedAnalyticsProps) {
  const analyticsData = useMemo(() => {
    // Daily completion data for the last 30 days
    const last30Days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date()
    })

    const dailyData = last30Days.map(date => {
      const dayLogs = habitLogs.filter(log => 
        new Date(log.completed_at).toDateString() === date.toDateString()
      )
      
      const completionRate = habits.length > 0 ? (dayLogs.length / habits.length) * 100 : 0
      
      return {
        date: format(date, 'MMM dd'),
        fullDate: date,
        completions: dayLogs.length,
        completionRate,
        totalHabits: habits.length
      }
    })

    // Weekly patterns
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i]
      const dayLogs = habitLogs.filter(log => new Date(log.completed_at).getDay() === i)
      
      return {
        day: dayName.slice(0, 3),
        completions: dayLogs.length,
        avgCompletions: dayLogs.length / Math.max(1, Math.ceil(habitLogs.length / 7))
      }
    })

    // Habit distribution
    const habitDistribution = habits.map(habit => {
      const logs = habitLogs.filter(log => log.habit_id === habit.id)
      return {
        name: habit.name,
        value: logs.length,
        color: habit.color,
        icon: habit.icon
      }
    })

    // Streak analysis
    const streakData = habits.map(habit => {
      const logs = habitLogs
        .filter(log => log.habit_id === habit.id)
        .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
      
      let currentStreak = 0
      let maxStreak = 0
      let tempStreak = 0
      
      const today = new Date()
      for (let i = 0; i < 365; i++) {
        const checkDate = subDays(today, i)
        const hasLog = logs.some(log => 
          new Date(log.completed_at).toDateString() === checkDate.toDateString()
        )
        
        if (hasLog) {
          if (i === currentStreak) currentStreak++
          tempStreak++
          maxStreak = Math.max(maxStreak, tempStreak)
        } else {
          tempStreak = 0
        }
      }
      
      return {
        name: habit.name,
        currentStreak,
        maxStreak,
        color: habit.color,
        consistency: logs.length / Math.max(1, Math.ceil((new Date().getTime() - new Date(habit.created_at).getTime()) / (1000 * 60 * 60 * 24))) * 100
      }
    })

    // Performance radar
    const performanceMetrics = {
      consistency: dailyData.reduce((sum, day) => sum + (day.completions > 0 ? 1 : 0), 0) / dailyData.length * 100,
      momentum: dailyData.slice(-7).reduce((sum, day) => sum + day.completionRate, 0) / 7,
      variety: new Set(habitLogs.map(log => log.habit_id)).size / Math.max(1, habits.length) * 100,
      intensity: habitLogs.length / Math.max(1, dailyData.length),
      growth: habits.length * 20,
      focus: streakData.reduce((sum, habit) => sum + habit.currentStreak, 0) / Math.max(1, habits.length) * 10
    }

    const radarData = [
      { metric: 'Consistency', value: Math.min(100, performanceMetrics.consistency), fullMark: 100 },
      { metric: 'Momentum', value: Math.min(100, performanceMetrics.momentum), fullMark: 100 },
      { metric: 'Variety', value: Math.min(100, performanceMetrics.variety), fullMark: 100 },
      { metric: 'Intensity', value: Math.min(100, performanceMetrics.intensity * 10), fullMark: 100 },
      { metric: 'Growth', value: Math.min(100, performanceMetrics.growth), fullMark: 100 },
      { metric: 'Focus', value: Math.min(100, performanceMetrics.focus), fullMark: 100 }
    ]

    return {
      dailyData,
      weeklyData,
      habitDistribution,
      streakData,
      radarData,
      performanceMetrics
    }
  }, [habits, habitLogs])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-dark p-3 rounded-lg border border-white/20">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name.includes('Rate') ? '%' : ''}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass" className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-neon-blue" />
              <div className="text-2xl font-bold text-white">
                {analyticsData.performanceMetrics.consistency.toFixed(0)}%
              </div>
              <p className="text-white/70 text-sm">Consistency</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glass" className="text-center">
            <CardContent className="pt-6">
              <Zap className="w-8 h-8 mx-auto mb-2 text-neon-purple" />
              <div className="text-2xl font-bold text-white">
                {analyticsData.performanceMetrics.momentum.toFixed(0)}%
              </div>
              <p className="text-white/70 text-sm">Momentum</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="glass" className="text-center">
            <CardContent className="pt-6">
              <Target className="w-8 h-8 mx-auto mb-2 text-neon-pink" />
              <div className="text-2xl font-bold text-white">
                {analyticsData.streakData.reduce((sum, h) => sum + h.currentStreak, 0)}
              </div>
              <p className="text-white/70 text-sm">Total Streaks</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="glass" className="text-center">
            <CardContent className="pt-6">
              <Activity className="w-8 h-8 mx-auto mb-2 text-neon-green" />
              <div className="text-2xl font-bold text-white">
                {habitLogs.length}
              </div>
              <p className="text-white/70 text-sm">Total Logs</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trend */}
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-5 h-5 text-neon-blue" />
              <CardTitle className="text-lg">30-Day Trend</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.dailyData}>
                <defs>
                  <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00f0ff" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="completionRate"
                  stroke="#00f0ff"
                  strokeWidth={2}
                  fill="url(#completionGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Pattern */}
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-neon-purple" />
              <CardTitle className="text-lg">Weekly Pattern</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="day" 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.6)"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="completions" 
                  fill="url(#barGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Habit Distribution */}
        {analyticsData.habitDistribution.length > 0 && (
          <Card variant="glass">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <PieChartIcon className="w-5 h-5 text-neon-pink" />
                <CardTitle className="text-lg">Habit Distribution</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.habitDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.habitDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload
                        return (
                          <div className="glass-dark p-3 rounded-lg border border-white/20">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{data.icon}</span>
                              <span className="text-white font-medium">{data.name}</span>
                            </div>
                            <p className="text-sm text-white/70">{data.value} completions</p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Performance Radar */}
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 text-neon-green" />
              <CardTitle className="text-lg">Performance Radar</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={analyticsData.radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                <PolarAngleAxis 
                  dataKey="metric" 
                  tick={{ fill: 'rgba(255,255,255,0.8)', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={0} 
                  domain={[0, 100]}
                  tick={false}
                />
                <Radar
                  name="Performance"
                  dataKey="value"
                  stroke="#00f0ff"
                  fill="#00f0ff"
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Streak Analysis */}
      {analyticsData.streakData.length > 0 && (
        <Card variant="glass">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-neon-blue" />
              <CardTitle className="text-lg">Streak Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.streakData.map((habit, index) => (
                <motion.div
                  key={habit.name}
                  className="p-4 rounded-lg bg-black/20 border border-white/10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-white font-medium">{habit.name}</h4>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">
                        {habit.currentStreak} days
                      </div>
                      <div className="text-sm text-white/60">
                        Best: {habit.maxStreak} days
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Current Streak</span>
                      <span className="text-white/90">{habit.currentStreak} days</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: habit.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (habit.currentStreak / Math.max(habit.maxStreak, 1)) * 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-white/70">Consistency</span>
                      <span className="text-white/90">{habit.consistency.toFixed(1)}%</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: habit.color, opacity: 0.7 }}
                        initial={{ width: 0 }}
                        animate={{ width: `${habit.consistency}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}