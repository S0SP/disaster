'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/auth-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogIn } from 'lucide-react'
import Link from 'next/link'

interface DashboardLayoutProps {
  children: React.ReactNode
  requiredRole?: string
  title?: string
}

export function DashboardLayout({
  children,
  requiredRole,
  title,
}: DashboardLayoutProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Redirect to login if not authenticated
  if (!isLoading && !user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="p-8 text-center max-w-md">
            <LogIn className="w-12 h-12 mx-auto text-muted-foreground opacity-50 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
            <p className="text-muted-foreground mb-6">
              Please log in to access this page.
            </p>
            <Link href="/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  // Check role if required
  if (user && requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="p-8 text-center max-w-md">
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-6">
              This page is only available for {requiredRole}s.
            </p>
            <Link href="/">
              <Button variant="outline" className="w-full">Back to Home</Button>
            </Link>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {title && (
            <div className="mb-8">
              <h1 className="text-3xl font-bold">{title}</h1>
            </div>
          )}
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}
