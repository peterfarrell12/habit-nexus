"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Atom, Zap, Eye, Waves, RotateCw } from "lucide-react"

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

interface QuantumState {
  probability: number
  energy: number
  coherence: number
  entanglement: number
}

interface QuantumHabitStatesProps {
  habits: Habit[]
  habitLogs: HabitLog[]
  onQuantumMeasurement: (habitId: string, state: 'completed' | 'collapsed') => void
}

export function QuantumHabitStates({ habits, habitLogs, onQuantumMeasurement }: QuantumHabitStatesProps) {
  const [quantumStates, setQuantumStates] = useState<Record<string, QuantumState>>({})
  const [observing, setObserving] = useState<string | null>(null)
  const [waveFunction, setWaveFunction] = useState(0)

  useEffect(() => {
    // Initialize quantum states for all habits
    const newStates: Record<string, QuantumState> = {}
    
    habits.forEach(habit => {
      const recentLogs = habitLogs.filter(log => 
        log.habit_id === habit.id &&
        new Date(log.completed_at) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      )
      
      const baseCompletionRate = recentLogs.length / 7
      const timeOfDay = new Date().getHours()
      const dayOfWeek = new Date().getDay()
      
      // Calculate probability based on historical patterns
      const timeFactor = Math.sin((timeOfDay / 24) * Math.PI * 2) * 0.3 + 0.7
      const dayFactor = dayOfWeek === 0 || dayOfWeek === 6 ? 0.8 : 1.0 // Weekends
      const randomQuantumFluctuation = (Math.random() - 0.5) * 0.2
      
      const probability = Math.max(0.1, Math.min(0.9, 
        baseCompletionRate * timeFactor * dayFactor + randomQuantumFluctuation
      ))
      
      newStates[habit.id] = {
        probability,
        energy: probability * 100 + Math.random() * 20,
        coherence: Math.random() * 0.8 + 0.2,
        entanglement: Math.random() * 0.6 + 0.1
      }
    })
    
    setQuantumStates(newStates)
  }, [habits, habitLogs])

  useEffect(() => {
    // Continuous wave function evolution
    const interval = setInterval(() => {
      setWaveFunction(prev => (prev + 1) % 360)
      
      // Update quantum states with time evolution
      setQuantumStates(prev => {
        const updated = { ...prev }
        Object.keys(updated).forEach(habitId => {
          const state = updated[habitId]
          const timeEvolution = Math.sin(waveFunction * Math.PI / 180) * 0.1
          
          updated[habitId] = {
            ...state,
            probability: Math.max(0.1, Math.min(0.9, state.probability + timeEvolution)),
            energy: state.energy + Math.sin(waveFunction * Math.PI / 90) * 5,
            coherence: Math.max(0.1, Math.min(1, state.coherence + Math.cos(waveFunction * Math.PI / 120) * 0.1))
          }
        })
        return updated
      })
    }, 100)

    return () => clearInterval(interval)
  }, [waveFunction])

  const observeHabit = (habitId: string) => {
    setObserving(habitId)
    const state = quantumStates[habitId]
    
    if (!state) return

    // Quantum measurement - wave function collapse
    setTimeout(() => {
      const measurement = Math.random()
      const collapsed = measurement < state.probability ? 'completed' : 'collapsed'
      
      onQuantumMeasurement(habitId, collapsed)
      
      // Update quantum state after measurement
      setQuantumStates(prev => ({
        ...prev,
        [habitId]: {
          ...prev[habitId],
          probability: collapsed === 'completed' ? 0.9 : 0.1,
          coherence: 0.1, // Decoherence after measurement
          energy: collapsed === 'completed' ? prev[habitId].energy + 20 : prev[habitId].energy - 10
        }
      }))
      
      setObserving(null)
    }, 2000)
  }

  const getQuantumColor = (probability: number): string => {
    if (probability > 0.7) return '#00f0ff'
    if (probability > 0.4) return '#a855f7'
    return '#f97316'
  }

  return (
    <Card variant="neon" className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-neon-blue/20 to-neon-purple/20">
            <Atom className="w-6 h-6 text-neon-blue" />
          </div>
          <div>
            <CardTitle className="text-xl">Quantum Habit States</CardTitle>
            <p className="text-white/70 text-sm">Probabilistic habit completion prediction</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Quantum Theory Explanation */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-neon-blue/10 to-neon-purple/10 border border-white/10">
            <p className="text-white/80 text-sm leading-relaxed">
              Your habits exist in quantum superposition until observed. Each habit has a probability wave that evolves with time, 
              influenced by your historical patterns, circadian rhythms, and quantum fluctuations.
            </p>
          </div>

          {/* Wave Function Visualization */}
          <div className="relative h-20 bg-black/20 rounded-lg overflow-hidden border border-white/10">
            <svg className="w-full h-full">
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style={{stopColor:'#00f0ff', stopOpacity:0.8}} />
                  <stop offset="50%" style={{stopColor:'#a855f7', stopOpacity:0.8}} />
                  <stop offset="100%" style={{stopColor:'#f97316', stopOpacity:0.8}} />
                </linearGradient>
              </defs>
              
              <motion.path
                d={`M 0 40 ${Array.from({ length: 50 }, (_, i) => {
                  const x = (i / 49) * 100
                  const y = 40 + Math.sin((waveFunction + i * 10) * Math.PI / 180) * 15
                  return `L ${x} ${y}`
                }).join(' ')}`}
                stroke="url(#waveGradient)"
                strokeWidth="2"
                fill="none"
                className="drop-shadow-sm"
              />
            </svg>
            <div className="absolute top-2 left-2 text-xs text-white/60">
              Ψ(x,t) = Σ|habit⟩ probability wave function
            </div>
          </div>

          {/* Quantum Habits */}
          <div className="space-y-4">
            {habits.map((habit) => {
              const state = quantumStates[habit.id]
              if (!state) return null

              const isObserving = observing === habit.id
              const quantumColor = getQuantumColor(state.probability)

              return (
                <motion.div
                  key={habit.id}
                  className="p-4 rounded-lg border border-white/10 bg-gradient-to-r from-black/20 to-transparent"
                  whileHover={{ scale: 1.02 }}
                  style={{ borderColor: `${quantumColor}40` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <motion.span 
                        className="text-xl"
                        animate={{ 
                          rotate: isObserving ? 360 : 0,
                          scale: isObserving ? [1, 1.2, 1] : 1
                        }}
                        transition={{ duration: isObserving ? 2 : 0 }}
                      >
                        {habit.icon}
                      </motion.span>
                      <div>
                        <h4 className="text-white font-medium">{habit.name}</h4>
                        <p className="text-white/60 text-sm">
                          |ψ⟩ = {(state.probability * 100).toFixed(1)}% |completed⟩ + {((1-state.probability) * 100).toFixed(1)}% |pending⟩
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => observeHabit(habit.id)}
                      disabled={isObserving}
                      className="space-x-2"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{isObserving ? 'Observing...' : 'Observe'}</span>
                    </Button>
                  </div>

                  {/* Quantum Properties */}
                  <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                      <div className="flex items-center space-x-1 mb-1">
                        <Waves className="w-3 h-3" style={{ color: quantumColor }} />
                        <span className="text-white/70">Probability</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded overflow-hidden">
                        <motion.div
                          className="h-full rounded"
                          style={{ backgroundColor: quantumColor }}
                          animate={{ width: `${state.probability * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-1 mb-1">
                        <Zap className="w-3 h-3" style={{ color: quantumColor }} />
                        <span className="text-white/70">Energy</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded overflow-hidden">
                        <motion.div
                          className="h-full rounded"
                          style={{ backgroundColor: quantumColor }}
                          animate={{ width: `${Math.min(100, state.energy)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-1 mb-1">
                        <RotateCw className="w-3 h-3" style={{ color: quantumColor }} />
                        <span className="text-white/70">Coherence</span>
                      </div>
                      <div className="h-1 bg-white/10 rounded overflow-hidden">
                        <motion.div
                          className="h-full rounded"
                          style={{ backgroundColor: quantumColor }}
                          animate={{ width: `${state.coherence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Observation Effect */}
                  <AnimatePresence>
                    {isObserving && (
                      <motion.div
                        className="mt-3 p-2 rounded bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 border border-white/20"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="flex items-center space-x-2">
                          <motion.div
                            className="w-2 h-2 rounded-full bg-neon-blue"
                            animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          />
                          <span className="text-white/80 text-sm">
                            Wave function collapsing... measuring quantum state...
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Quantum Entanglement Network */}
          {habits.length > 1 && (
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-neon-purple/10 to-neon-pink/10 border border-white/10">
              <h4 className="text-white font-medium mb-2 flex items-center space-x-2">
                <Atom className="w-4 h-4 text-neon-purple" />
                <span>Quantum Entanglement Network</span>
              </h4>
              <p className="text-white/70 text-sm mb-3">
                Your habits are quantum entangled. Completing one affects the probability states of others.
              </p>
              
              <div className="flex justify-center">
                <svg width="200" height="80" className="overflow-visible">
                  {habits.slice(0, 4).map((habit, i) => {
                    const angle = (i / Math.max(1, habits.slice(0, 4).length - 1)) * Math.PI
                    const x = 100 + Math.cos(angle) * 60
                    const y = 40 + Math.sin(angle) * 20
                    const state = quantumStates[habit.id]
                    
                    return (
                      <g key={habit.id}>
                        {/* Entanglement lines */}
                        {habits.slice(0, 4).map((otherHabit, j) => {
                          if (i >= j) return null
                          const otherAngle = (j / Math.max(1, habits.slice(0, 4).length - 1)) * Math.PI
                          const otherX = 100 + Math.cos(otherAngle) * 60
                          const otherY = 40 + Math.sin(otherAngle) * 20
                          
                          return (
                            <motion.line
                              key={`${i}-${j}`}
                              x1={x}
                              y1={y}
                              x2={otherX}
                              y2={otherY}
                              stroke="rgba(0, 240, 255, 0.3)"
                              strokeWidth="1"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 2, delay: i * 0.2 }}
                            />
                          )
                        })}
                        
                        {/* Habit nodes */}
                        <motion.circle
                          cx={x}
                          cy={y}
                          r="8"
                          fill={state ? getQuantumColor(state.probability) : '#666'}
                          opacity="0.8"
                          animate={{ 
                            scale: state ? [1, 1 + state.probability * 0.5, 1] : 1,
                            opacity: state ? [0.8, 0.4, 0.8] : 0.8
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                        />
                        
                        <text
                          x={x}
                          y={y + 20}
                          textAnchor="middle"
                          className="text-xs fill-white/60"
                        >
                          {habit.icon}
                        </text>
                      </g>
                    )
                  })}
                </svg>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}