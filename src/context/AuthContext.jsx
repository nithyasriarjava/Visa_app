import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../components/supabaseClient'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          firstName: session.user.user_metadata?.full_name?.split(' ')[0] || session.user.email.split('@')[0],
          lastName: session.user.user_metadata?.full_name?.split(' ')[1] || '',
          role: session.user.email?.includes('admin') ? 'admin' : 'user'
        }
        setUser(userData)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          firstName: session.user.user_metadata?.full_name?.split(' ')[0] || session.user.email.split('@')[0],
          lastName: session.user.user_metadata?.full_name?.split(' ')[1] || '',
          role: session.user.email?.includes('admin') ? 'admin' : 'user'
        }
        setUser(userData)
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email, password) => {
    // Simple demo login - replace with your backend API
    if (email && password) {
      const user = {
        id: Date.now().toString(),
        email,
        firstName: email.split('@')[0],
        lastName: '',
        role: email.includes('admin') ? 'admin' : 'user'
      }
      setUser(user)
      localStorage.setItem('currentUser', JSON.stringify(user))
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const register = async (email, password) => {
    // Simple demo registration - replace with your backend API
    if (email && password) {
      const user = {
        id: Date.now().toString(),
        email,
        firstName: email.split('@')[0],
        lastName: '',
        role: 'user'
      }
      setUser(user)
      localStorage.setItem('currentUser', JSON.stringify(user))
      return { success: true }
    }
    return { success: false, error: 'Registration failed' }
  }

  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/profile`
        }
      })
      if (error) {
        console.error('Google sign-in error:', error)
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (error) {
      console.error('Google authentication failed:', error)
      return { success: false, error: 'Authentication failed' }
    }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = '/'
  }

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
