"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, AlertCircle, Info } from "lucide-react"

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  isVisible: boolean
  onClose: () => void
}

export function Toast({ message, type = 'success', duration = 3000, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const icons = {
    success: <Check className="w-5 h-5" />,
    error: <X className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  }

  const colors = {
    success: 'from-green-500 to-emerald-500',
    error: 'from-red-500 to-rose-500',
    warning: 'from-yellow-500 to-orange-500',
    info: 'from-blue-500 to-cyan-500'
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100]"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-xl glass-dark border border-white/20 backdrop-blur-lg shadow-2xl max-w-sm`}>
            <div className={`p-1 rounded-full bg-gradient-to-r ${colors[type]} text-white`}>
              {icons[type]}
            </div>
            <span className="text-white font-medium">{message}</span>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook for easy toast usage
export function useToast() {
  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    isVisible: boolean
  }>({
    message: '',
    type: 'success',
    isVisible: false
  })

  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    setToast({ message, type, isVisible: true })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  return {
    toast,
    showToast,
    hideToast
  }
}