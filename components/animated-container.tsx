'use client'

import React, { ReactNode } from 'react'

interface AnimatedContainerProps {
  children: ReactNode
  delay?: number
  stagger?: boolean
  className?: string
}

export function AnimatedContainer({
  children,
  delay = 0,
  stagger = false,
  className = '',
}: AnimatedContainerProps) {
  return (
    <div
      className={`animate-fade-in ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}

// Card animation component
export function AnimatedCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`animate-fade-in hover:-translate-y-1 transition-transform ${className}`}>
      {children}
    </div>
  )
}
