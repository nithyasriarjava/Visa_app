import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { FileText } from 'lucide-react'

const Login = ({ setIsLogin }) => {
  const [error, setError] = useState('')
  const { login } = useAuth()

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com",
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      })

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        { 
          theme: "outline", 
          size: "large",
          width: 400,
          text: "signin_with",
          shape: "rectangular"
        }
      )
    }
  }, [])

  const handleCredentialResponse = async (response) => {
    try {
      const userObject = JSON.parse(atob(response.credential.split('.')[1]))
      
      const result = await login(userObject.email, {
        firstName: userObject.given_name,
        lastName: userObject.family_name,
        picture: userObject.picture,
        googleId: userObject.sub
      })
      
      if (!result.success) {
        setError(result.error)
      }
    } catch (err) {
      setError('Authentication failed')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        padding: '48px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        width: '100%',
        maxWidth: '450px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            borderRadius: '20px',
            marginBottom: '24px',
            boxShadow: '0 15px 35px rgba(59, 130, 246, 0.3)'
          }}>
            <FileText style={{ width: '40px', height: '40px', color: 'white' }} />
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>
            Visa Manager
          </h1>
          <p style={{ color: '#64748b', margin: '12px 0 0 0', fontSize: '16px' }}>
            Sign in with Google
          </p>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <div id="googleSignInButton" style={{ marginBottom: '32px' }}></div>

        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid #e2e8f0'
        }}>
          <p style={{ color: '#64748b', margin: '0 0 16px 0', fontSize: '14px' }}>
            Don't have an account?
          </p>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login