import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useNavigate } from 'react-router-dom'
import { APP_CONFIG, MESSAGES, VALIDATION } from '../lib/constants'

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
        localStorage.setItem('token', session.access_token)
      }
      setLoading(false)
    })

    // Listen for login/logout changes - PERMANENT listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          const userData = formatUser(session.user)
          setUser(userData)
          localStorage.setItem('token', session.access_token)
          setLoading(false)
          // Removed auto navigation to prevent forced redirects
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          localStorage.removeItem('token')
          setLoading(false)
        }
      }
    )

    // Only cleanup on component unmount - keep listener active
    return () => subscription.unsubscribe()
  }, [navigate])

  // Format user data
  const formatUser = (user) => ({
    id: user.id,
    email: user.email,
    firstName:
      user.user_metadata?.full_name?.split(' ')[0] ||
      (user.email ? user.email.split('@')[0] : ''),
    lastName:
      user.user_metadata?.full_name?.split(' ')[1] || '',
    role: user.email?.includes('admin') ? 'admin' : 'user',
  })

  // Validate form inputs
  const validateForm = (email, password, isLogin = false) => {
    if (!email?.trim()) return 'Email required'
    if (!VALIDATION.email.test(email.trim())) return 'Invalid email format'
    if (!password?.trim()) return 'Password required'
    if (!isLogin && password.trim().length < VALIDATION.minPasswordLength) return `Password minimum ${VALIDATION.minPasswordLength} characters`
    return null
  }

  // Helper: check if email exists in your 'profiles' table
  // (This is the most reliable client-side check — keep profiles synced on any login)
  const emailExistsInProfiles = async (email) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, provider')
        .ilike('email', email.trim())
        .limit(1)
        .maybeSingle()

      if (error) {
        console.warn('profiles lookup error:', error)
        // don't hard-fail on lookup errors; return false so signup can still proceed,
        // but log it so you can investigate.
        return { exists: false, error }
      }

      return { exists: !!data, data }
    } catch (err) {
      console.error('profiles lookup exception:', err)
      return { exists: false, error: err }
    }
  }

  // Email-password login
  const login = async (email, password) => {
    const validationError = validateForm(email, password, true)
    if (validationError) {
      return { success: false, error: validationError }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      })

      if (error) {
        // Handle specific Supabase auth errors
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: MESSAGES.error.noAccount }
        }
        if (error.message.includes('Email not confirmed') || error.message.includes('email_not_confirmed')) {
          return { success: false, error: MESSAGES.error.verifyEmail }
        }
        if (error.message.includes('Invalid email or password')) {
          return { success: false, error: MESSAGES.error.incorrectPassword }
        }
        return { success: false, error: error.message }
      }

      // Handle successful login with verified email
      if (data?.user && data?.session) {
        const userData = formatUser(data.user)
        setUser(userData)
        localStorage.setItem('token', data.session.access_token)
        navigate('/profile')
        return { success: true, error: null, message: MESSAGES.success.login }
      }

      // Handle unverified email (user exists but no session)
      if (data?.user && !data?.session) {
        return { success: false, error: MESSAGES.error.verifyEmail }
      }

      return { success: false, error: MESSAGES.error.loginFailed }
    } catch (error) {
      return { success: false, error: MESSAGES.error.loginFailed }
    }
  }

  // Register new user - UPDATED to block duplicate OAuth emails
  const register = async (email, password) => {
    const validationError = validateForm(email, password, false);
    if (validationError) {
      return { success: false, error: validationError };
    }

    // --- CLIENT-SIDE PRECHECK ------------
    // Check profiles table first. If an entry exists, block signup and direct to OAuth login.
    const emailCheck = await emailExistsInProfiles(email);
    if (emailCheck.error) {
      // optional: you could block signup on lookup error, but here we allow signup to continue
      // so the app remains usable even if profiles read fails. We just log the error.
      console.warn('Could not confirm if email exists in profiles. Proceeding to signup attempt.');
    } else if (emailCheck.exists) {
      // If profile exists, we assume user already registered (likely via Google/OAuth)
      return {
        success: false,
        error: "An account with this email already exists. Please sign in using Google (or your original provider).",
        shouldRedirectToLogin: true,
      };
    }

    // --- PROCEED TO SIGNUP ------------
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
      });

      console.log('Supabase signUp response:', { data, error });

      // If Supabase says user already registered (fallback safety)
      if (error && (error.message?.includes("User already registered") || error.message?.includes("already registered"))) {
        return {
          success: false,
          error: "Account already exists. Please sign in.",
          shouldRedirectToLogin: true,
        };
      }

      // Generic error returned
      if (error) {
        return { success: false, error: error.message || 'Registration failed' };
      }

      // On success, Supabase commonly sends a confirmation email (if email confirmations enabled)
      return {
        success: true,
        error: null,
        message: "Verification email sent. Please check your inbox.",
      };

    } catch (error) {
      console.error('register catch error:', error)
      return { success: false, error: "Registration failed" };
    }
  };

  // Password reset
  const resetPassword = async (email) => {
    const validationError = validateForm(email, 'dummy', true)
    if (validationError && !validationError.includes('Password')) {
      return { success: false, error: validationError }
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: window.location.origin + APP_CONFIG.resetPasswordPath
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, message: MESSAGES.success.passwordReset }
    } catch (error) {
      return { success: false, error: MESSAGES.error.passwordReset }
    }
  }

  const loginWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: APP_CONFIG.redirectUrl,
        },
      });

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch {
      return { success: false, error: MESSAGES.error.googleAuthFailed };
    }
  };


  // Logout
  const logout = async () => {
    try {
      await supabase.auth.signOut()
      localStorage.removeItem('token')
      setUser(null)
      setLoading(false)
      navigate('/')
    } catch (error) {
      localStorage.removeItem('token')
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
