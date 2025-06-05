"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MobileLayout } from "@/components/layout/MobileLayout"
import { QuickAuth } from "@/components/auth/QuickAuth"
import { HabitsTab } from "@/components/mobile/HabitsTab"
import { AdvancedAnalytics } from "@/components/dashboard/AdvancedAnalytics"
import { ProfileTab } from "@/components/mobile/ProfileTab"
import { CreateHabitModal } from "@/components/mobile/CreateHabitModal"
import { Toast, useToast } from "@/components/ui/Toast"

type TabType = 'habits' | 'dashboard' | 'profile'

export default function MobileApp() {
  const [currentTab, setCurrentTab] = useState<TabType>('habits')
  const [showAuth, setShowAuth] = useState(false)
  const [showCreateHabit, setShowCreateHabit] = useState(false)
  const [habits, setHabits] = useState<any[]>([])
  const [habitLogs, setHabitLogs] = useState<any[]>([])
  const { toast, showToast, hideToast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    // Load data on client side
    if (typeof window !== 'undefined') {
      const storedHabits = localStorage.getItem('habits')
      const storedLogs = localStorage.getItem('habitLogs')
      
      setHabits(storedHabits ? JSON.parse(storedHabits) : [])
      setHabitLogs(storedLogs ? JSON.parse(storedLogs) : [])
    }
  }

  const renderTabContent = () => {
    switch (currentTab) {
      case 'habits':
        return <HabitsTab onCreateHabit={() => setShowCreateHabit(true)} onDataChange={loadData} />
      
      case 'dashboard':
        return (
          <div className="p-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Analytics Dashboard</h2>
              <p className="text-white/70">Your habit insights and progress</p>
            </div>
            <AdvancedAnalytics habits={habits} habitLogs={habitLogs} />
          </div>
        )
      
      case 'profile':
        return <ProfileTab onShowAuth={() => setShowAuth(true)} />
      
      default:
        return <HabitsTab onCreateHabit={() => setShowCreateHabit(true)} />
    }
  }

  return (
    <>
      <MobileLayout
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onShowAuth={() => setShowAuth(true)}
      >
        {renderTabContent()}
      </MobileLayout>

      <QuickAuth 
        isOpen={showAuth} 
        onClose={() => setShowAuth(false)} 
      />

      <CreateHabitModal 
        isOpen={showCreateHabit} 
        onClose={() => setShowCreateHabit(false)}
        onHabitCreated={() => {
          loadData()
          showToast('Habit created successfully! 🎉', 'success')
        }}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  )
}