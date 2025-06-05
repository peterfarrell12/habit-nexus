"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { HTMLAttributes, forwardRef } from "react"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glass" | "neon"
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hover = true, children, ...props }, ref) => {
    const baseClasses = "rounded-xl p-6 transition-all duration-300"
    
    const variants = {
      default: "glass-dark border border-white/10 hover:border-neon-blue/30",
      glass: "glass border border-white/20 hover:border-neon-purple/40",
      neon: "neon-border bg-gradient-to-br from-neon-blue/5 to-neon-purple/5 hover:from-neon-blue/10 hover:to-neon-purple/10"
    }

    const hoverEffects = hover ? "hover:shadow-cyber hover:scale-[1.02]" : ""

    return (
      <motion.div
        ref={ref}
        className={cn(baseClasses, variants[variant], hoverEffects, className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={hover ? { y: -2 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = "Card"

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 pb-4", className)}
      {...props}
    />
  )
)
CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-xl font-semibold leading-none tracking-tight text-white", className)}
      {...props}
    />
  )
)
CardTitle.displayName = "CardTitle"

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-white/70", className)}
      {...props}
    />
  )
)
CardDescription.displayName = "CardDescription"

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("text-white/90", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardDescription, CardContent }