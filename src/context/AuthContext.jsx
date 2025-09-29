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
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) {
        const supabaseUser = {
          id: data.session.user.id,
          email: data.session.user.email,
          firstName: data.session.user.user_metadata?.first_name || data.session.user.email.split('@')[0],
          lastName: data.session.user.user_metadata?.last_name || '',
          role: 'user'
        }
        setUser(supabaseUser)
      }
      setLoading(false)
    }
    getSession()
    const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const supabaseUser = {
          id: session.user.id,
          email: session.user.email,
          firstName: session.user.user_metadata?.first_name || session.user.email.split('@')[0],
          lastName: session.user.user_metadata?.last_name || '',
          role: 'user'
        }
        setUser(supabaseUser)
      } else {
        setUser(null)
      }
    })
    return () => subscription?.unsubscribe()
  }, [])

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, error: error.message }
    setUser(data.user)
    return { success: true }
  }

  const register = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin }
    })
    if (error) return { success: false, error: error.message }
    setUser(data.user)
    return { success: true }
  }

  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { 
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account consent'
        }
      }
    })
    if (error) return { success: false, error: error.message }
    return { success: true }
  }

  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' })
      setUser(null)
      
      // Clear all localStorage data
      localStorage.clear()
      
      // Clear session storage
      sessionStorage.clear()
      
      // Clear any Google auth cookies by redirecting to Google logout
      const googleLogoutUrl = 'https://accounts.google.com/logout'
      
      // Open Google logout in hidden iframe to clear Google session
      const iframe = document.createElement('iframe')
      iframe.style.display = 'none'
      iframe.src = googleLogoutUrl
      document.body.appendChild(iframe)
      
      setTimeout(() => {
        document.body.removeChild(iframe)
        // Force page reload to clear all state
        window.location.href = '/'
      }, 1000)
      
    } catch (error) {
      console.error('Logout error:', error)
      // Force reload even if logout fails
      window.location.href = '/'
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
