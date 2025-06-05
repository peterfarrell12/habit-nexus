"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/auth"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  LogOut, 
  Crown,
  Zap,
  Brain,
  Shield,
  Moon,
  Bell,
  Download,
  Upload,
  Trash2
} from "lucide-react"

interface ProfileTabProps {
  onShowAuth: () => void
}

export function ProfileTab({ onShowAuth }: ProfileTabProps) {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState({
    totalHabits: 0,
    totalLogs: 0,
    longestStreak: 0,
    joinDate: ''
  })
  
  const supabase = createClient()

  useEffect(() => {
    checkUser()
    loadStats()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    }
  }

  const loadStats = () => {
    const habits = JSON.parse(localStorage.getItem('habits') || '[]')
    const logs = JSON.parse(localStorage.getItem('habitLogs') || '[]')
    
    const streaks = habits.map((habit: any) => {
      const habitLogs = logs
        .filter((log: any) => log.habit_id === habit.id)
        .sort((a: any, b: any) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
      
      let streak = 0
      const today = new Date()
      
      for (let i = 0; i < habitLogs.length; i++) {
        const logDate = new Date(habitLogs[i].completed_at)
        const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff === streak) {
          streak++
        } else {
          break
        }
      }
      
      return streak
    })

    setStats({
      totalHabits: habits.length,
      totalLogs: logs.length,
      longestStreak: Math.max(...streaks, 0),
      joinDate: user?.created_at || new Date().toISOString()
    })
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const exportData = () => {
    const habits = localStorage.getItem('habits') || '[]'
    const logs = localStorage.getItem('habitLogs') || '[]'
    
    const data = {
      habits: JSON.parse(habits),
      logs: JSON.parse(logs),
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `habit-nexus-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const clearData = () => {
    if (confirm('Are you sure you want to clear all your habit data? This cannot be undone.')) {
      localStorage.removeItem('habits')
      localStorage.removeItem('habitLogs')
      setStats({
        totalHabits: 0,
        totalLogs: 0,
        longestStreak: 0,
        joinDate: ''
      })
    }
  }

  if (!user) {
    return (
      <div className="p-4 space-y-6">
        {/* Sign In Prompt */}
        <Card variant="neon" className="text-center">
          <CardContent className="p-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            
            <h2 className="text-xl font-bold text-white mb-2">Sign In to Sync</h2>
            <p className="text-white/70 mb-6">
              Save your progress across devices and unlock advanced features
            </p>
            
            <Button variant="neon" onClick={onShowAuth} className="w-full">
              Sign In / Sign Up
            </Button>
          </CardContent>
        </Card>

        {/* Demo Stats */}
        <Card variant="glass">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Demo Progress</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-blue">{stats.totalHabits}</div>
                <div className="text-sm text-white/70">Habits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-purple">{stats.totalLogs}</div>
                <div className="text-sm text-white/70">Completions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Settings</h3>
          
          <Card variant="glass">
            <CardContent className="p-0">
              <button className="w-full p-4 flex items-center space-x-3 hover:bg-white/5 transition-colors">
                <Download className="w-5 h-5 text-white/70" />
                <span className="text-white" onClick={exportData}>Export Data</span>
              </button>
              
              <button 
                onClick={clearData}
                className="w-full p-4 flex items-center space-x-3 hover:bg-white/5 transition-colors border-t border-white/10"
              >
                <Trash2 className="w-5 h-5 text-red-400" />
                <span className="text-red-400">Clear All Data</span>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      {/* User Profile */}
      <Card variant="neon">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{user.email}</h2>
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <Calendar className="w-4 h-4" />
                <span>
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="p-2 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-lg">
              <Crown className="w-6 h-6 text-yellow-400" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-blue">{stats.totalHabits}</div>
              <div className="text-sm text-white/70">Habits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-purple">{stats.totalLogs}</div>
              <div className="text-sm text-white/70">Completions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-pink">{stats.longestStreak}</div>
              <div className="text-sm text-white/70">Best Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Neural Enhancement Status */}
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Brain className="w-6 h-6 text-neon-blue" />
            <h3 className="text-lg font-semibold text-white">Neural Enhancement</h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80">Consciousness Level</span>
              <span className="text-neon-blue font-medium">Level 7</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
            <div className="text-sm text-white/60">
              Complete 3 more habits to reach Level 8
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Settings</h3>
        
        <Card variant="glass">
          <CardContent className="p-0">
            <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-white/70" />
                <span className="text-white">Notifications</span>
              </div>
              <div className="w-12 h-6 bg-neon-blue/30 rounded-full p-1">
                <div className="w-4 h-4 bg-neon-blue rounded-full ml-auto" />
              </div>
            </button>
            
            <button className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors border-t border-white/10">
              <div className="flex items-center space-x-3">
                <Moon className="w-5 h-5 text-white/70" />
                <span className="text-white">Dark Mode</span>
              </div>
              <div className="w-12 h-6 bg-neon-purple/30 rounded-full p-1">
                <div className="w-4 h-4 bg-neon-purple rounded-full ml-auto" />
              </div>
            </button>
            
            <button className="w-full p-4 flex items-center space-x-3 hover:bg-white/5 transition-colors border-t border-white/10">
              <Shield className="w-5 h-5 text-white/70" />
              <span className="text-white">Privacy & Security</span>
            </button>
            
            <button 
              onClick={exportData}
              className="w-full p-4 flex items-center space-x-3 hover:bg-white/5 transition-colors border-t border-white/10"
            >
              <Download className="w-5 h-5 text-white/70" />
              <span className="text-white">Export Data</span>
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Danger Zone */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
        
        <Card variant="glass">
          <CardContent className="p-0">
            <button 
              onClick={clearData}
              className="w-full p-4 flex items-center space-x-3 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-5 h-5 text-red-400" />
              <span className="text-red-400">Clear All Data</span>
            </button>
            
            <button 
              onClick={handleSignOut}
              className="w-full p-4 flex items-center space-x-3 hover:bg-red-500/10 transition-colors border-t border-white/10"
            >
              <LogOut className="w-5 h-5 text-red-400" />
              <span className="text-red-400">Sign Out</span>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}