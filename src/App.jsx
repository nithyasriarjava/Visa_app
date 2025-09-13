import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import VisaApply from './pages/VisaApply'
import AdminDashboard from './pages/AdminDashboard'
import ApiTest from './pages/ApiTest'
import './App.css'

const AppContent = () => {
  const { user, loading } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')

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

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />
      case 'visa-apply':
        return <VisaApply />
      case 'api-test':
        return <ApiTest />
      case 'admin':
        return user.role === 'admin' ? <AdminDashboard /> : <Profile />
      default:
        return <Profile />
    }
  }

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App