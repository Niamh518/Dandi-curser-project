'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  // Function to ensure user profile exists
  const ensureUserProfile = async (user: User) => {
    try {
      // Check if user profile exists
      const response = await fetch('/api/auth/user-profile')
      
      if (response.status === 404) {
        // Profile doesn't exist, create it
        console.log('Creating user profile for:', user.email)
        const createResponse = await fetch('/api/auth/user-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (createResponse.ok) {
          console.log('User profile created successfully')
        } else {
          console.error('Failed to create user profile')
        }
      } else if (response.ok) {
        console.log('User profile already exists')
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      
      // Ensure user profile exists if user is logged in
      if (session?.user) {
        await ensureUserProfile(session.user)
      }
      
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        // Handle user profile creation for new sign-ins
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in:', session.user.email)
          await ensureUserProfile(session.user)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Error signing in with Google:', error)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    session,
    loading,
    signInWithGoogle,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
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
