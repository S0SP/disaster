'use client'

import React from 'react'
import { ProofSubmission } from '@/lib/mock-data'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Users, CheckCircle, Clock, XCircle } from 'lucide-react'

interface ProofCardProps {
  proof: ProofSubmission
}

export function ProofCard({ proof }: ProofCardProps) {
  const getStatusIcon = () => {
    switch (proof.status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = () => {
    switch (proof.status) {
      case 'verified':
        return 'bg-green-50 text-green-700'
      case 'pending':
        return 'bg-yellow-50 text-yellow-700'
      case 'rejected':
        return 'bg-red-50 text-red-700'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-2 mb-2">
            <h4 className="font-semibold text-sm flex-1">{proof.title}</h4>
            <Badge className={getStatusColor()}>
              {proof.status.charAt(0).toUpperCase() + proof.status.slice(1)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
            {proof.description}
          </p>

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{proof.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{proof.beneficiariesAffected.toLocaleString()} beneficiaries</span>
            </div>
            <div>
              <span>${proof.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          {getStatusIcon()}
        </div>
      </div>
    </Card>
  )
}
