import { createContext, useContext, ReactNode, useState } from 'react'
import { db } from '../lib/instant'

interface AuthContextType {
  user: any | null
  isLoading: boolean
  signInWithEmail: (email: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // For demo purposes, we'll mock the auth state
  // In production, this would use: const { user, isLoading } = db.useAuth()
  const [mockUser, setMockUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const signInWithEmail = async (email: string) => {
    // Mock authentication for demo
    setIsLoading(true)
    setTimeout(() => {
      setMockUser({ id: 'demo-user', email })
      setIsLoading(false)
    }, 1000)
  }

  const signOut = () => {
    setMockUser(null)
  }

  return (
    <AuthContext.Provider value={{ user: mockUser, isLoading, signInWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}