"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { InputHTMLAttributes, forwardRef } from "react"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-white/90">
            {label}
          </label>
        )}
        <motion.input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg glass-dark border border-white/20 bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-neon-blue/50 focus:border-neon-blue/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
            error && "border-red-500 focus:ring-red-500/50 focus:border-red-500",
            className
          )}
          ref={ref}
          whileFocus={{ scale: 1.02 }}
          {...props}
        />
        {error && (
          <motion.p
            className="text-sm text-red-400"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }