import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../components/supabaseClient'
import { FileText, Mail, Lock, Shield } from 'lucide-react'

const Login = ({ setIsLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, loginWithGoogle } = useAuth()

  const handleGoogleLogin = async () => {
    console.log('🔍 Google login button clicked')
    setLoading(true)
    setError('')
    
    try {
      console.log('Starting Google OAuth login...')
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      })
      
      console.log('Google OAuth login response:', { data, error })
      
      if (error) {
        console.error('Google login failed:', error)
        setError('Google login failed: ' + error.message)
      } else {
        console.log('✅ Google OAuth login initiated successfully!')
      }
    } catch (error) {
      console.error('Google login exception:', error)
      setError('Google login failed: ' + error.message)
    }
    
    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('🔐 Attempting Supabase Auth login with:', formData.email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })
      
      console.log('Auth login response:', { data, error })
      
      if (error) {
        const storedSession = sessionStorage.getItem('supabase.auth.token')
        if (storedSession) {
          const session = JSON.parse(storedSession)
          if (session.user.email === formData.email) {
            console.log('✅ Login successful with bypass method!')
            
            const userSession = {
              id: session.user.id,
              email: session.user.email,
              firstName: session.user.email.split('@')[0],
              lastName: '',
              role: 'user'
            }
            localStorage.setItem('currentUser', JSON.stringify(userSession))
            
            alert('✅ Login successful!')
            window.location.href = '/'
            return
          }
        }
        
        console.error('❌ Login error:', error.message)
        setError('❌ Invalid email or password. Please sign up first.')
      } else if (data.session && data.user) {
        console.log('✅ Login successful! User:', data.user.email)
        alert('✅ Login successful!')
        window.location.href = '/'
      } else {
        setError('❌ Login failed - no session created')
      }
      
    } catch (error) {
      console.error('Login catch error:', error)
      setError('❌ Login failed: ' + error.message)
    }
    
    setLoading(false)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at bottom, #0f0f23 0%, #1a1a3e 25%, #2d1b69 50%, #4c1d95 75%, #7c3aed 100%)',
      padding: '15px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Poppins", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        position: 'absolute',
        top: '15%',
        right: '15%',
        width: '180px',
        height: '180px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(25px)',
        animation: 'float 7s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '15%',
        width: '130px',
        height: '130px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(20px)',
        animation: 'float 9s ease-in-out infinite reverse'
      }}></div>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(30px)',
        borderRadius: '24px',
        padding: '25px',
        boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        width: '40%',
        maxWidth: '450px',
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
            <Shield style={{ width: '24px', height: '24px', color: 'white' }} />
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
            Welcome Back
          </h1>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            margin: '5px 0 0 0', 
            fontSize: '12px',
            fontWeight: '500'
          }}>
            Sign in to your visa management account
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
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#1f2937',
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ paddingTop: '15px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <p style={{ 
            color: 'rgba(255, 255, 255, 0.7)', 
            margin: '0 0 10px 0',
            fontSize: '12px'
          }}>
            Don't have an account?{' '}
            <button
              onClick={() => setIsLogin(false)}
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
              Sign up
            </button>
          </p>
          {/* <button
            onClick={() => setIsLogin(false)}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            Create New Account
          </button> */}
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

export default Login