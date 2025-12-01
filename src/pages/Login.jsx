import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, Plane, ArrowRight, Globe, CheckCircle } from 'lucide-react';

const Login = ({ setIsLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { login, loginWithGoogle, resetPassword } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        setMessage(result.message || 'Login successful!');
        // Navigation is handled in AuthContext
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!resetEmail.trim()) {
      setError('Please enter your email address');
      return;
    }

    try {
      const result = await resetPassword(resetEmail);
      if (result.success) {
        setMessage(result.message);
        setShowResetPassword(false);
        setResetEmail('');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to send reset email');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        setError(result.error || 'Google authentication failed. Please try again.');
      }
    } catch (error) {
      setError('Google authentication failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-slate-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-slate-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-300/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20">
          <div className="max-w-lg">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl flex items-center justify-center mr-4">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">VisaFlow</h1>
            </div>
            
            <h2 className="text-2xl xl:text-3xl font-bold text-white mb-4 leading-tight">
              Your Gateway to
              <span className="bg-gradient-to-r from-slate-300 to-slate-400 bg-clip-text text-transparent"> Global Travel</span>
            </h2>
            
            <p className="text-base text-slate-200 mb-8 leading-relaxed">
              Streamline your visa applications with our intelligent platform. Fast, secure, and reliable visa processing.
            </p>
            
            <div className="space-y-4">
              {[
                'AI-powered application assistance',
                'Real-time status tracking',
                'Expert consultation available',
                'Secure document management'
              ].map((feature, index) => (
                <div key={index} className="flex items-center text-slate-200">
                  <CheckCircle className="w-4 h-4 text-slate-400 mr-3 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
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

            {/* Login Card */}
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
              <div className="text-center mb-6">
                <h2 className="text-lg font-bold text-white mb-1">Welcome Back</h2>
                <p className="text-slate-200 text-sm">Sign in to continue your visa journey</p>
              </div>

              {(error || message) && (
                <div className={`px-4 py-3 rounded-xl mb-6 backdrop-blur-sm ${
                  message 
                    ? 'bg-green-500/10 border border-green-500/20 text-green-300'
                    : 'bg-red-500/10 border border-red-500/20 text-red-300'
                }`}>
                  {message || error}
                </div>
              )}

              {showResetPassword && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6 backdrop-blur-sm">
                  <h3 className="text-white font-semibold mb-3 text-sm">Reset Password</h3>
                  <form onSubmit={handlePasswordReset} className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-300 text-sm"
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-slate-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                      >
                        Send Reset Email
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowResetPassword(false)}
                        className="px-4 py-2 text-slate-300 hover:text-white text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-200">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-slate-300 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-slate-400/50 focus:ring-2 focus:ring-slate-400/20 transition-all duration-200 text-white placeholder-slate-300 backdrop-blur-sm text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-200">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-slate-300 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-slate-400/50 focus:ring-2 focus:ring-slate-400/20 transition-all duration-200 text-white placeholder-slate-300 backdrop-blur-sm text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white py-3 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl hover:from-slate-900 hover:to-slate-800 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 border-t border-white/10"></div>
                <span className="px-3 text-slate-300 text-xs font-medium">OR</span>
                <div className="flex-1 border-t border-white/10"></div>
              </div>

              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                className="w-full bg-white/5 border border-white/10 text-white py-3 rounded-lg font-semibold text-sm shadow-md hover:bg-white/10 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Register Link & Password Reset */}
              <div className="text-center mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => setShowResetPassword(!showResetPassword)}
                  className="text-slate-300 hover:text-slate-200 text-sm transition-colors"
                >
                  Forgot your password?
                </button>
                
                <p className="text-slate-200 text-sm">
                  Don't have an account?{' '}
                  <button 
                    onClick={() => setIsLogin(false)}
                    className="text-slate-300 hover:text-slate-200 font-semibold transition-colors"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-slate-300 text-xs flex items-center justify-center gap-2">
                <Globe className="w-3 h-3" />
                Trusted by travelers worldwide
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;