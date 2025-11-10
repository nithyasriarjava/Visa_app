import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../components/supabaseClient'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Get current session when app starts
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userData = formatUser(session.user)
        setUser(userData)
      }
      setLoading(false)
    })

    // Listen for login/logout changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          const userData = formatUser(session.user)
          setUser(userData)

          // Redirect only after successful sign-in
          if (event === 'SIGNED_IN') {
            setTimeout(() => navigate('/profile'), 500)
          }
        } else {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [navigate])

  // Format user data
  const formatUser = (user) => ({
    id: user.id,
    email: user.email,
    firstName:
      user.user_metadata?.full_name?.split(' ')[0] ||
      user.email.split('@')[0],
    lastName:
      user.user_metadata?.full_name?.split(' ')[1] || '',
    role: user.email?.includes('admin') ? 'admin' : 'user',
  })

 // Email-password login (Fixed)
const login = async (email, password) => {
  try {
    console.log('Attempting login with:', email)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    })

    if (error) {
      console.error('Supabase login error:', error.message)

      // Handle known errors clearly
      if (error.message.includes('Invalid login credentials')) {
        return { success: false, error: 'Invalid email or password' }
      }
      if (error.message.includes('Email not confirmed')) {
        return { success: false, error: 'Please verify your email before login' }
      }

      return { success: false, error: error.message }
    }

    if (data?.user) {
      const userData = formatUser(data.user)
      setUser(userData)
      navigate('/profile')
      return { success: true }
    }

    return { success: false, error: 'Login failed — no user data returned' }
  } catch (error) {
    console.error('Unexpected login error:', error)
    return { success: false, error: 'Something went wrong during login' }
  }
}


  // Register new user
  const register = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password })
      
      if (error) {
        if (error.message.includes('User already registered') || 
            error.message.includes('already registered') ||
            error.message.includes('Email address is already registered')) {
          return { success: false, error: 'This email already exists' }
        }
        return { success: false, error: error.message }
      }
      
      // If signup returns user but no session, it's a new user needing confirmation
      // If it returns both user and session, it's an existing user being signed in
      if (data?.user && data?.session) {
        return { success: false, error: 'This email already exists' }
      }
      
      return { success: true }
    } catch {
      return { success: false, error: 'Registration failed' }
    }
  }

  // Google login/signup
  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo:
            process.env.NODE_ENV === 'production'
              ? 'https://nithyasriarjava.github.io/Visa_app/#/profile'
              : 'http://localhost:5173/#/profile',
        },
      })
      if (error) return { success: false, error: error.message }
      return { success: true }
    } catch {
      return { success: false, error: 'Google authentication failed' }
    }
  }

  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      localStorage.removeItem('currentUser')
      navigate('/')
    } catch {
      setUser(null)
      localStorage.removeItem('currentUser')
      navigate('/')
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, loginWithGoogle, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
