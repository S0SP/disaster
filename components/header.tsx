'use client'

import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/auth-context'
import { Button } from '@/components/ui/button'
import { Menu, LogOut, LayoutDashboard, Home } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'donor':
        return 'bg-primary/10 text-primary'
      case 'ngo':
        return 'bg-secondary/10 text-secondary'
      case 'voter':
        return 'bg-primary/10 text-primary'
      case 'admin':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-muted text-muted-foreground'
    }
  }

  const getNavLinks = () => {
    if (!user) return []
    
    const baseLinks = [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]

    if (user.role === 'donor') {
      return [
        { href: '/', label: 'Browse Campaigns', icon: Home },
        ...baseLinks,
      ]
    }
    if (user.role === 'ngo') {
      return [
        { href: '/ngo/campaigns', label: 'My Campaigns', icon: Home },
        ...baseLinks,
      ]
    }
    if (user.role === 'voter') {
      return [
        { href: '/voter/proposals', label: 'Proposals', icon: Home },
        ...baseLinks,
      ]
    }
    if (user.role === 'admin') {
      return [
        { href: '/admin/audits', label: 'Audit Logs', icon: Home },
        ...baseLinks,
      ]
    }

    return baseLinks
  }

  const navLinks = getNavLinks()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">SH</span>
            </div>
            <span className="font-bold text-lg hidden sm:inline">SAHAYATA</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className={`hidden sm:inline px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground truncate max-w-[150px]">
                    {user.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-muted rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-3 border-t border-border overflow-hidden animate-slide-down">
            {navLinks.map((link) => (
              <div key={link.href} className="animate-fade-in">
                <Link
                  href={link.href}
                  className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
