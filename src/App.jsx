import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import VisaApply from './pages/VisaApply'
import AdminDashboard from './pages/AdminDashboard'

import './App.css'

const AppContent = () => {
  const { user, loading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e2e8f0',
          borderTop: '4px solid #3b82f6',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    )
  }

  if (!user) {
    return isLogin ? (
      <Login setIsLogin={setIsLogin} />
    ) : (
      <Register setIsLogin={setIsLogin} />
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/profile" replace />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/visa-apply" element={<VisaApply />} />

        <Route path="/admin" element={user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/profile" replace />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
       <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App