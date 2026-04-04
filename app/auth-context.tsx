'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { User, mockUsers } from '@/lib/mock-data'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  switchRole: (userId: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true)
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Find user by email in mock data
      const foundUser = mockUsers.find((u) => u.email === email)
      if (foundUser) {
        setUser(foundUser)
      } else {
        throw new Error('User not found')
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  const switchRole = useCallback((userId: string) => {
    const newUser = mockUsers.find((u) => u.id === userId)
    if (newUser) {
      setUser(newUser)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
