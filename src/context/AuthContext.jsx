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

    // Listen for login/logout changes - PERMANENT listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event, 'Session:', !!session?.user)
        
        if (session?.user) {
          const userData = formatUser(session.user)
          setUser(userData)
          setLoading(false)
          // Removed auto navigation to prevent forced redirects
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setLoading(false)
        }
      }
    )

    // Only cleanup on component unmount - keep listener active
    return () => subscription.unsubscribe()
  }, [navigate, user])

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

  // Validate form inputs
  const validateForm = (email, password, isLogin = false) => {
    if (!email?.trim()) return 'Email required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return 'Invalid email format'
    if (!password?.trim()) return 'Password required'
    if (!isLogin && password.trim().length < 6) return 'Password minimum 6 characters'
    return null
  }

  // Email-password login
  const login = async (email, password) => {
    const validationError = validateForm(email, password, true)
    if (validationError) {
      return { success: false, error: validationError }
    }

    try {
      console.log('Attempting login with email:', email.trim())
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })
      console.log('Supabase response:', { user: !!data?.user, session: !!data?.session, error: error?.message })

      if (error) {
        // Handle specific Supabase auth errors
        if (error.message.includes('Invalid login credentials')) {
          // This could be either wrong password or user not found
          return { success: false, error: 'No account found. Please signup.' }
        }
        if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
          return { success: false, error: 'Verify email before login' }
        }
        if (error.message.includes('Invalid email or password')) {
          return { success: false, error: 'Incorrect password' }
        }
        return { success: false, error: error.message }
      }

      // Handle successful login with verified email
      if (data?.user && data?.session) {
        const userData = formatUser(data.user)
        setUser(userData)
        navigate('/profile')
        return { success: true, error: null, message: 'Login successful' }
      }

      // Handle unverified email (user exists but no session)
      if (data?.user && !data?.session) {
        return { success: false, error: 'Verify email before login' }
      }

      return { success: false, error: 'Login failed' }
    } catch (error) {
      return { success: false, error: 'Login failed' }
    }
  }

  // Register new user
  const register = async (email, password) => {
    const validationError = validateForm(email, password, false)
    if (validationError) {
      return { success: false, error: validationError }
    }

    try {
      const { data, error } = await supabase.auth.signUp({ 
        email: email.trim(), 
        password: password.trim() 
      })
      
      if (error) {
        if (error.message.includes('User already registered') || 
            error.message.includes('already registered')) {
          return { success: false, error: 'Account exists, please login', shouldRedirectToLogin: true }
        }
        return { success: false, error: error.message }
      }
      
      // Check if user already exists (Supabase returns user with session for existing users)
      if (data?.user && data?.session) {
        return { success: false, error: 'Account exists, please login', shouldRedirectToLogin: true }
      }
      
      // New user created successfully (user exists but no session = needs email verification)
      if (data?.user && !data?.session) {
        return { success: true, error: null, message: 'Check email & verify' }
      }
      
      return { success: true, error: null, message: 'Check email & verify' }
    } catch (error) {
      return { success: false, error: 'Registration failed' }
    }
  }

  // Password reset
  const resetPassword = async (email) => {
    const validationError = validateForm(email, 'dummy', true)
    if (validationError && !validationError.includes('Password')) {
      return { success: false, error: validationError }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + '/#/reset-password'
      })
      
      if (error) {
        return { success: false, error: error.message }
      }
      
      return { success: true, message: 'Password reset email sent!' }
    } catch (error) {
      return { success: false, error: 'Failed to send reset email' }
    }
  }

 const loginWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: "https://nithyasriarjava.github.io/Visa_app/",
      },
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch {
    return { success: false, error: "Google authentication failed" };
  }
};


  // Logout
  const logout = async () => {
    try {
      console.log('Logging out...')
      await supabase.auth.signOut()
      setUser(null)
      setLoading(false)
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      setUser(null)
      setLoading(false)
      navigate('/')
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, login, register, loginWithGoogle, logout, loading, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  )
}