import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, Plane, UserPlus, Globe, Shield, Zap } from 'lucide-react'

const Register = ({ setIsLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, loginWithGoogle } = useAuth()

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
      const result = await loginWithGoogle()
      if (!result.success) {
        setError(result.error || 'Google signup failed')
      }
    } catch (error) {
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
      const result = await register(formData.email, formData.password)
      if (result.success) {
        console.log('✅ Registration successful!')
        setFormData({ email: '', password: '' })
        setError('📧 Confirmation email sent! Please check your inbox to verify your account before logging in.')
      } else {
        setError(result.error || 'Registration failed')
      }
    } catch (error) {
      setError('Registration failed: ' + error.message)
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-slate-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-slate-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-300/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20">
          <div className="max-w-lg">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl flex items-center justify-center mr-4">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">VisaFlow</h1>
            </div>
            
            <h2 className="text-2xl xl:text-3xl font-bold text-white mb-4 leading-tight">
              Start Your
              <span className="bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent"> Journey Today</span>
            </h2>
            
            <p className="text-base text-slate-200 mb-8 leading-relaxed">
              Join thousands of travelers who trust VisaFlow for their visa applications. Experience the future of travel documentation.
            </p>
            
            <div className="grid grid-cols-1 gap-6">
              {[
                {
                  icon: <Zap className="w-5 h-5 text-slate-400" />,
                  title: 'Lightning Fast',
                  description: 'Process applications in record time'
                },
                {
                  icon: <Shield className="w-5 h-5 text-slate-400" />,
                  title: 'Bank-Level Security',
                  description: 'Your documents are protected with enterprise-grade encryption'
                },
                {
                  icon: <Globe className="w-5 h-5 text-slate-400" />,
                  title: 'Global Coverage',
                  description: 'Support for 150+ countries and territories'
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="text-white font-semibold mb-1 text-sm">{feature.title}</h3>
                    <p className="text-slate-200 text-xs">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl flex items-center justify-center mr-3">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">VisaFlow</h1>
              </div>
            </div>

            {/* Register Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-slate-800/20 to-slate-900/20 rounded-xl mb-3 border border-slate-700/30">
                  <UserPlus className="w-6 h-6 text-slate-400" />
                </div>
                <h2 className="text-lg font-bold text-white mb-1">Create Account</h2>
                <p className="text-slate-200 text-sm">Join the future of visa management</p>
              </div>

              {error && (
                <div className={`px-4 py-3 rounded-xl mb-6 backdrop-blur-sm ${
                  error.includes('📧') 
                    ? 'bg-green-500/10 border border-green-500/20 text-green-300'
                    : 'bg-red-500/10 border border-red-500/20 text-red-300'
                }`}>
                  {error}
                </div>
              )}

              {/* Google Signup Button */}
              <button
                onClick={handleGoogleSignup}
                disabled={loading}
                className="w-full bg-white/5 border border-white/10 text-white py-3 rounded-lg font-semibold text-sm shadow-md hover:bg-white/10 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 mb-4 backdrop-blur-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? 'Connecting...' : 'Continue with Google'}
              </button>
              
              {/* Divider */}
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-white/10"></div>
                <span className="px-3 text-slate-300 text-xs font-medium">OR</span>
                <div className="flex-1 border-t border-white/10"></div>
              </div>
              
              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-200">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-slate-300 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-slate-400/50 focus:ring-2 focus:ring-slate-400/20 transition-all duration-200 text-white placeholder-slate-300 backdrop-blur-sm text-sm"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-slate-200">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-slate-300 transition-colors" />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-slate-400/50 focus:ring-2 focus:ring-slate-400/20 transition-all duration-200 text-white placeholder-slate-300 backdrop-blur-sm text-sm"
                      placeholder="Enter your password (min 6 characters)"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-3 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl hover:from-slate-900 hover:to-slate-800 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="text-center mt-6">
                <p className="text-slate-200 text-sm">
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-slate-300 hover:text-slate-200 font-semibold transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>

            {/* Bottom Text */}
            <div className="text-center mt-6">
              <p className="text-slate-300 text-xs flex items-center justify-center gap-2">
                <Shield className="w-3 h-3" />
                Your data is protected with enterprise-grade security
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register