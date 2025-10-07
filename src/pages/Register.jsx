import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../components/supabaseClient'
import { FileText, Mail, Lock, Sparkles } from 'lucide-react'

const Register = ({ setIsLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const errors = {}
    if (!formData.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = 'Invalid email format'
    if (!formData.password) errors.password = 'Password is required'
    else if (formData.password.length < 6) errors.password = 'Password must be at least 6 characters'
    return errors
  }

  const handleGoogleSignup = async () => {
    setLoading(true)
    setError('')
    
    try {
      console.log('🔍 Starting Google OAuth signup...')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      })
      
      console.log('Google OAuth response:', { data, error })
      
      if (error) {
        console.error('Google OAuth error:', error)
        setError('Google signup failed: ' + error.message)
      } else {
        console.log('✅ Google OAuth initiated successfully')
      }
    } catch (error) {
      console.error('Google signup exception:', error)
      setError('Google signup failed: ' + error.message)
    }
    
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setError(Object.values(validationErrors)[0])
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('🔍 Checking Supabase configuration...')
      console.log('Supabase URL:', supabase.supabaseUrl)
      console.log('Supabase Key:', supabase.supabaseKey?.substring(0, 20) + '...')
      
      console.log('📤 Attempting Supabase Auth signup...')
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      })
      
      console.log('Full Auth response:', JSON.stringify({ data, error }, null, 2))
      
      if (error) {
        console.error('❌ Auth Error Details:')
        console.error('- Message:', error.message)
        console.error('- Status:', error.status)
        console.error('- Code:', error.code)
        
        setError(`❌ Supabase Error: ${error.message}. Please check your Supabase project settings.`)
      } else if (data.user) {
        console.log('✅ User created in Supabase Auth!')
        console.log('User ID:', data.user.id)
        console.log('User Email:', data.user.email)
        
        alert('✅ Account created successfully in Supabase Auth!')
        setFormData({ email: '', password: '' })
        // AuthContext will automatically detect the new user and navigate
      } else {
        console.log('⚠️ No error but no user data returned')
        setError('Signup failed - no user data returned')
      }
      
    } catch (error) {
      console.error('❌ Signup exception:', error)
      setError(`❌ Signup failed: ${error.message}`)
    }

    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, #0f0f23 0%, #1a1a3e 25%, #2d1b69 50%, #4c1d95 75%, #7c3aed 100%)',
      padding: '15px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '200px',
        height: '200px',
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(30px)',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(25px)',
        animation: 'float 8s ease-in-out infinite reverse'
      }}></div>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(30px)',
        borderRadius: '24px',
        padding: '25px',
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        width: '40%',
        maxWidth: '240px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ marginBottom: '25px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            borderRadius: '16px',
            marginBottom: '15px',
            boxShadow: '0 10px 20px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles style={{ width: '24px', height: '24px', color: 'white' }} />
          </div>
          <h1 style={{
            fontSize: '20px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 50%, #c7d2fe 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            letterSpacing: '-0.01em'
          }}>
            Create Account
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            margin: '5px 0 0 0', 
            fontSize: '12px',
            fontWeight: '500'
          }}>
            Join the future of visa management
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            color: '#fca5a5',
            padding: '10px',
            borderRadius: '12px',
            marginBottom: '15px',
            fontSize: '11px',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            backdropFilter: 'blur(10px)'
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Connecting...' : 'Continue with Google'}
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
          <span style={{ 
            padding: '0 12px', 
            color: 'rgba(255, 255, 255, 0.6)', 
            fontSize: '12px',
            fontWeight: '500'
          }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.2)' }}></div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Mail style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                width: '16px', 
                height: '16px', 
                color: 'rgba(255, 255, 255, 0.6)' 
              }} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 35px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  fontSize: '13px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  outline: 'none',
                  backdropFilter: 'blur(10px)'
                }}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <div style={{ position: 'relative' }}>
              <Lock style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)', 
                width: '16px', 
                height: '16px', 
                color: 'rgba(255, 255, 255, 0.6)' 
              }} />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px 10px 10px 35px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  fontSize: '13px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  outline: 'none',
                  backdropFilter: 'blur(10px)'
                }}
                placeholder="Enter your password"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '0.025em',
              cursor: 'pointer',
              marginBottom: '15px',
              boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ paddingTop: '15px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            margin: 0,
            fontSize: '12px'
          }}>
            Already have an account?{' '}
            <button
              onClick={() => setIsLogin(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#a78bfa',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '12px'
              }}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(180deg); }
        }
      `}</style>
    </div>
  )
}

export default Register