"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "neon"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseClasses = "relative overflow-hidden font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue/50"
    
    const variants = {
      primary: "glass-dark text-white hover:bg-white/10 border border-white/20 hover:border-neon-blue/50",
      secondary: "bg-cyber-light text-white hover:bg-cyber-accent border border-cyber-accent",
      ghost: "text-neon-blue hover:bg-neon-blue/10 border border-transparent hover:border-neon-blue/30",
      neon: "neon-border bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 text-white hover:from-neon-blue/30 hover:to-neon-purple/30"
    }
    
    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    }

    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        {children}
      </motion.button>
    )
  }
)

Button.displayName = "Button"

export { Button }