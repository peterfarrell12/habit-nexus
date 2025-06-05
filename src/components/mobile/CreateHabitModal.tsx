"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Check
} from "lucide-react"

interface CreateHabitModalProps {
  isOpen: boolean
  onClose: () => void
  onHabitCreated: () => void
}

interface HabitPreset {
  name: string
  description: string
  icon: string
  color: string
  category: string
}

const habitPresets: HabitPreset[] = [
  // Health & Fitness
  { name: "Morning Workout", description: "Start the day with exercise", icon: "💪", color: "#f97316", category: "Fitness" },
  { name: "Drink Water", description: "Stay hydrated throughout the day", icon: "💧", color: "#06b6d4", category: "Health" },
  { name: "10K Steps", description: "Walk 10,000 steps daily", icon: "🏃", color: "#10b981", category: "Fitness" },
  { name: "Healthy Meal", description: "Eat a nutritious meal", icon: "🥗", color: "#22c55e", category: "Health" },
  
  // Mental & Learning
  { name: "Meditation", description: "Practice mindfulness daily", icon: "🧘", color: "#a855f7", category: "Mindfulness" },
  { name: "Read 30 Minutes", description: "Daily reading habit", icon: "📚", color: "#3b82f6", category: "Learning" },
  { name: "Journal", description: "Write down thoughts and reflections", icon: "📝", color: "#8b5cf6", category: "Mindfulness" },
  { name: "Learn Something New", description: "Acquire new knowledge daily", icon: "🧠", color: "#00f0ff", category: "Learning" },
  
  // Productivity
  { name: "No Phone in Bed", description: "Keep phone away from bedroom", icon: "📱", color: "#ef4444", category: "Digital" },
  { name: "Plan Tomorrow", description: "Prepare for the next day", icon: "📅", color: "#f59e0b", category: "Planning" },
  { name: "Clean Workspace", description: "Organize and tidy work area", icon: "🧹", color: "#84cc16", category: "Organization" },
  { name: "Early Wake Up", description: "Rise early for a productive day", icon: "🌅", color: "#f97316", category: "Routine" },
]

const colorOptions = [
  "#00f0ff", "#a855f7", "#f97316", "#10b981", 
  "#ef4444", "#f59e0b", "#8b5cf6", "#06b6d4",
  "#22c55e", "#3b82f6", "#ec4899", "#84cc16"
]

const iconOptions = [
  "🎯", "⭐", "🔥", "💪", "🧠", "❤️", "🌱", "📚", 
  "💧", "🏃", "🧘", "🎨", "🍎", "☀️", "🌙", "⚡"
]

export function CreateHabitModal({ isOpen, onClose, onHabitCreated }: CreateHabitModalProps) {
  const [step, setStep] = useState<'presets' | 'custom' | 'details'>('presets')
  const [selectedPreset, setSelectedPreset] = useState<HabitPreset | null>(null)
  const [customHabit, setCustomHabit] = useState({
    name: '',
    description: '',
    icon: '🎯',
    color: '#00f0ff'
  })
  const [loading, setLoading] = useState(false)

  const handlePresetSelect = (preset: HabitPreset) => {
    setSelectedPreset(preset)
    setCustomHabit({
      name: preset.name,
      description: preset.description,
      icon: preset.icon,
      color: preset.color
    })
    setStep('details')
  }

  const handleCustomHabit = () => {
    setSelectedPreset(null)
    setCustomHabit({
      name: '',
      description: '',
      icon: '🎯',
      color: '#00f0ff'
    })
    setStep('custom')
  }

  const createHabit = async () => {
    if (!customHabit.name.trim()) return

    setLoading(true)
    
    try {
      const newHabit = {
        id: crypto.randomUUID(),
        name: customHabit.name,
        description: customHabit.description || null,
        color: customHabit.color,
        icon: customHabit.icon,
        created_at: new Date().toISOString(),
        user_id: 'demo-user'
      }

      // Get existing habits
      const existingHabits = JSON.parse(localStorage.getItem('habits') || '[]')
      
      // Add new habit
      const updatedHabits = [...existingHabits, newHabit]
      localStorage.setItem('habits', JSON.stringify(updatedHabits))

      // Success feedback
      onHabitCreated()
      onClose()
      resetForm()
      
    } catch (error) {
      console.error('Error creating habit:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep('presets')
    setSelectedPreset(null)
    setCustomHabit({
      name: '',
      description: '',
      icon: '🎯',
      color: '#00f0ff'
    })
  }

  const handleClose = () => {
    onClose()
    setTimeout(resetForm, 300) // Reset after animation
  }

  const categories = [...new Set(habitPresets.map(p => p.category))]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="w-full max-w-md bg-gradient-to-br from-cyber-dark to-cyber-light rounded-t-2xl glass-dark border-t border-white/20 max-h-[90vh] overflow-hidden"
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-12 h-1 bg-white/30 rounded-full mx-auto mt-3" />
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                {step !== 'presets' && (
                  <button
                    onClick={() => setStep(step === 'details' ? 'presets' : 'presets')}
                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5 text-white/70" />
                  </button>
                )}
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {step === 'presets' ? 'Create Habit' : 
                     step === 'custom' ? 'Custom Habit' : 'Habit Details'}
                  </h2>
                  <p className="text-sm text-white/60">
                    {step === 'presets' ? 'Choose a preset or create custom' : 
                     step === 'custom' ? 'Design your own habit' : 'Review and customize'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-100px)] mobile-scroll">
              <AnimatePresence mode="wait">
                {/* Step 1: Presets */}
                {step === 'presets' && (
                  <motion.div
                    key="presets"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 space-y-6"
                  >
                    {/* Quick Presets */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Popular Habits</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {habitPresets.slice(0, 4).map((preset, index) => (
                          <motion.button
                            key={preset.name}
                            onClick={() => handlePresetSelect(preset)}
                            className="p-4 rounded-xl glass border border-white/20 text-left hover:border-neon-blue/50 transition-all"
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="text-2xl mb-2">{preset.icon}</div>
                            <div className="text-sm font-medium text-white">{preset.name}</div>
                            <div className="text-xs text-white/60 mt-1">{preset.description}</div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">Browse Categories</h3>
                      <div className="space-y-3">
                        {categories.map((category) => {
                          const categoryHabits = habitPresets.filter(p => p.category === category)
                          return (
                            <div key={category}>
                              <h4 className="text-sm font-medium text-white/80 mb-2">{category}</h4>
                              <div className="grid grid-cols-1 gap-2">
                                {categoryHabits.map((preset) => (
                                  <motion.button
                                    key={preset.name}
                                    onClick={() => handlePresetSelect(preset)}
                                    className="flex items-center space-x-3 p-3 rounded-lg glass border border-white/10 hover:border-neon-blue/30 transition-all text-left"
                                    whileTap={{ scale: 0.98 }}
                                  >
                                    <div 
                                      className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                                      style={{ backgroundColor: `${preset.color}20`, border: `1px solid ${preset.color}40` }}
                                    >
                                      {preset.icon}
                                    </div>
                                    <div className="flex-1">
                                      <div className="text-sm font-medium text-white">{preset.name}</div>
                                      <div className="text-xs text-white/60">{preset.description}</div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-white/40" />
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Custom Option */}
                    <motion.button
                      onClick={handleCustomHabit}
                      className="w-full p-4 rounded-xl border-2 border-dashed border-white/30 hover:border-neon-blue/50 transition-all text-center"
                      whileTap={{ scale: 0.98 }}
                    >
                      <Sparkles className="w-6 h-6 mx-auto mb-2 text-neon-blue" />
                      <div className="text-sm font-medium text-white">Create Custom Habit</div>
                      <div className="text-xs text-white/60">Design your own unique habit</div>
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 2: Custom Creation */}
                {step === 'custom' && (
                  <motion.div
                    key="custom"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 space-y-6"
                  >
                    <div className="space-y-4">
                      <Input
                        label="Habit Name"
                        value={customHabit.name}
                        onChange={(e) => setCustomHabit({ ...customHabit, name: e.target.value })}
                        placeholder="e.g., Morning Run"
                      />
                      
                      <Input
                        label="Description (Optional)"
                        value={customHabit.description}
                        onChange={(e) => setCustomHabit({ ...customHabit, description: e.target.value })}
                        placeholder="e.g., 30 minutes of jogging"
                      />
                      
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-3">Choose Icon</label>
                        <div className="grid grid-cols-8 gap-2">
                          {iconOptions.map((icon) => (
                            <button
                              key={icon}
                              onClick={() => setCustomHabit({ ...customHabit, icon })}
                              className={`p-2 rounded-lg border transition-all ${
                                customHabit.icon === icon 
                                  ? 'border-neon-blue bg-neon-blue/20' 
                                  : 'border-white/20 hover:border-white/40'
                              }`}
                            >
                              <span className="text-lg">{icon}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-white/90 mb-3">Choose Color</label>
                        <div className="grid grid-cols-6 gap-2">
                          {colorOptions.map((color) => (
                            <button
                              key={color}
                              onClick={() => setCustomHabit({ ...customHabit, color })}
                              className={`w-8 h-8 rounded-full border-2 transition-all ${
                                customHabit.color === color 
                                  ? 'border-white scale-110' 
                                  : 'border-white/20 hover:border-white/40'
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="neon"
                      onClick={() => setStep('details')}
                      disabled={!customHabit.name.trim()}
                      className="w-full"
                    >
                      Continue to Review
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                )}

                {/* Step 3: Details & Confirmation */}
                {step === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="p-6 space-y-6"
                  >
                    {/* Preview */}
                    <div className="text-center">
                      <div 
                        className="w-20 h-20 rounded-xl mx-auto mb-4 flex items-center justify-center text-3xl"
                        style={{ backgroundColor: `${customHabit.color}20`, border: `2px solid ${customHabit.color}40` }}
                      >
                        {customHabit.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white">{customHabit.name}</h3>
                      {customHabit.description && (
                        <p className="text-white/70 mt-1">{customHabit.description}</p>
                      )}
                    </div>

                    {/* Edit Options */}
                    <div className="space-y-4">
                      <Input
                        label="Habit Name"
                        value={customHabit.name}
                        onChange={(e) => setCustomHabit({ ...customHabit, name: e.target.value })}
                      />
                      
                      <Input
                        label="Description (Optional)"
                        value={customHabit.description}
                        onChange={(e) => setCustomHabit({ ...customHabit, description: e.target.value })}
                      />
                    </div>

                    {/* Create Button */}
                    <Button
                      variant="neon"
                      onClick={createHabit}
                      disabled={loading || !customHabit.name.trim()}
                      className="w-full"
                    >
                      {loading ? (
                        <>Creating...</>
                      ) : (
                        <>
                          <Check className="w-4 h-4 mr-2" />
                          Create Habit
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}