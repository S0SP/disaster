'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  subtext?: string
  color?: 'primary' | 'secondary' | 'accent' | 'destructive'
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  subtext,
  color = 'primary',
}: StatsCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-primary/10 text-primary',
    destructive: 'bg-destructive/10 text-destructive',
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
          {subtext && (
            <p className="text-xs text-muted-foreground mt-2">{subtext}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  )
}
