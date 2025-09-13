import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui/Button'
import { User, FileText, Shield, LogOut, Home, Bell } from 'lucide-react'

const Layout = ({ children, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth()

  const menuItems = [
    { id: 'profile', label: 'Dashboard', icon: Home },
    { id: 'visa-apply', label: 'Visa Application', icon: FileText },
    ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: Shield }] : [])
  ]

  const sidebarStyle = {
    width: '280px',
    background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    borderRight: '1px solid rgba(255, 255, 255, 0.1)'
  }

  const headerStyle = {
    padding: '32px 24px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
  }

  const navItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    borderRadius: '12px',
    margin: '8px 16px',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: isActive 
      ? 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)' 
      : 'transparent',
    color: isActive ? 'white' : '#cbd5e1',
    transform: isActive ? 'translateX(8px)' : 'translateX(0)',
    boxShadow: isActive ? '0 10px 25px rgba(59, 130, 246, 0.3)' : 'none'
  })

  const mainContentStyle = {
    flex: 1,
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    minHeight: '100vh'
  }

  const topBarStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
    padding: '24px 32px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
            }}>
              <FileText style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
            </div>
            <div>
              <h1 style={{
                fontSize: '24px',
                fontWeight: '800',
                color: 'white',
                margin: 0,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}>
                Visa Manager
              </h1>
              <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                Professional Portal
              </p>
            </div>
          </div>
        </div>
        
        {/* User Info */}
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User style={{ width: '20px', height: '20px', color: 'white' }} />
            </div>
            <div>
              <p style={{ fontWeight: '600', color: 'white', margin: 0 }}>
                {user?.firstName} {user?.lastName}
              </p>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                {user?.email}
              </p>
              <span style={{
                display: 'inline-block',
                padding: '4px 8px',
                fontSize: '10px',
                borderRadius: '12px',
                marginTop: '4px',
                background: user?.role === 'admin' ? '#8b5cf6' : '#3b82f6',
                color: 'white',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {user?.role === 'admin' ? 'Administrator' : 'User'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav style={{ padding: '16px 0', flex: 1 }}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={navItemStyle(isActive)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)'
                    e.target.style.transform = 'translateX(4px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'transparent'
                    e.target.style.transform = 'translateX(0)'
                  }
                }}
              >
                <Icon style={{ 
                  width: '20px', 
                  height: '20px', 
                  marginRight: '12px',
                  color: isActive ? 'white' : '#94a3b8'
                }} />
                <span style={{ fontWeight: '600', fontSize: '14px' }}>{item.label}</span>
              </div>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div style={{ padding: '24px' }}>
          <Button
            onClick={logout}
            style={{
              width: '100%',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '12px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            <LogOut style={{ width: '16px', height: '16px' }} />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainContentStyle}>
        {/* Top Bar */}
        <div style={topBarStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{
                fontSize: '32px',
                fontWeight: '800',
                color: '#1e293b',
                margin: 0,
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                position: 'relative',
                padding: '12px',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer'
              }}>
                <Bell style={{ width: '20px', height: '20px', color: '#64748b' }} />
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '8px',
                  height: '8px',
                  background: '#ef4444',
                  borderRadius: '50%'
                }}></span>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: '32px' }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Layout