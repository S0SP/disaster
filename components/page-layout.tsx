'use client'

import React from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

interface PageLayoutProps {
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
}

export function PageLayout({
  children,
  showHeader = true,
  showFooter = true,
}: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {showHeader && <Header />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  )
}
