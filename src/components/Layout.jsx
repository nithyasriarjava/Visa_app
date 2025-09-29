import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui/Button'
import { User, FileText, Shield, LogOut, Home, Bell, Menu, ChevronLeft, X } from 'lucide-react'

const Layout = ({ children, activeTab, setActiveTab }) => {
  const { user, logout } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(window.innerWidth > 768)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const notificationRef = useRef(null)
  const bellRef = useRef(null)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarExpanded(false)
        setSidebarOpen(false)
      } else {
        setSidebarExpanded(true)
        setSidebarOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && 
          notificationRef.current && 
          !notificationRef.current.contains(event.target) &&
          bellRef.current &&
          !bellRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications])

  const menuItems = [
    { id: 'profile', label: 'Dashboard', icon: Home },
    { id: 'visa-apply', label: 'Visa Application', icon: FileText },
    ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: Shield }] : [])
  ]

  return (
    <div className="app-container" style={{ display: 'flex', height: '100vh', position: 'relative' }}>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div style={{
        width: isMobile ? '280px' : (sidebarExpanded ? '280px' : '60px'),
        minWidth: isMobile ? '280px' : (sidebarExpanded ? '280px' : '60px'),
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(30px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
        position: isMobile ? 'fixed' : 'relative',
        left: isMobile ? (sidebarOpen ? '0' : '-280px') : '0',
        top: isMobile ? '0' : 'auto',
        height: isMobile ? '100vh' : 'auto',
        zIndex: 999
      }}>
        {/* Header */}
        <div style={{
          padding: (isMobile || sidebarExpanded) ? '24px' : '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: (isMobile || sidebarExpanded) ? 'space-between' : 'center',
          position: 'relative'
        }}>
          {(isMobile || sidebarExpanded) ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <FileText style={{ width: '16px', height: '16px', color: 'white' }} />
                </div>
                <div>
                  <h1 style={{
                    fontSize: '16px',
                    fontWeight: '800',
                    color: 'white',
                    margin: 0
                  }}>
                    Visa Manager
                  </h1>
                  <p style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                    Professional Portal
                  </p>
                </div>
              </div>
              <button
                onClick={() => isMobile ? setSidebarOpen(false) : setSidebarExpanded(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '6px',
                  padding: '6px',
                  cursor: 'pointer',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
              >
                {isMobile ? <X size={14} /> : <ChevronLeft size={14} />}
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarExpanded(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                padding: '8px',
                cursor: 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <Menu size={16} />
            </button>
          )}
        </div>

        {/* User Info */}
        {(isMobile || sidebarExpanded) && (
          <div style={{ padding: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User style={{ width: '14px', height: '14px', color: 'white' }} />
              </div>
              <div>
                <p style={{ fontWeight: '600', color: 'white', margin: 0, fontSize: '12px' }}>
                  {user?.firstName} {user?.lastName}
                </p>
                <p style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                  {user?.email}
                </p>
                <span style={{
                  display: 'inline-block',
                  padding: '1px 4px',
                  fontSize: '8px',
                  borderRadius: '6px',
                  marginTop: '2px',
                  background: user?.role === 'admin' ? '#8b5cf6' : '#6366f1',
                  color: 'white',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {user?.role === 'admin' ? 'Admin' : 'User'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={{ padding: '12px 0', flex: 1 }}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <div
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: (isMobile || sidebarExpanded) ? 'flex-start' : 'center',
                  padding: (isMobile || sidebarExpanded) ? '12px 16px' : '12px 8px',
                  borderRadius: '8px',
                  margin: (isMobile || sidebarExpanded) ? '4px 12px' : '4px 8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: isActive
                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)'
                    : 'transparent',
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.8)',
                  boxShadow: isActive ? '0 6px 15px rgba(99, 102, 241, 0.3)' : 'none',
                  position: 'relative'
                }}
              >
                <Icon style={{
                  width: '18px',
                  height: '18px',
                  marginRight: (isMobile || sidebarExpanded) ? '12px' : '0',
                  color: isActive ? 'white' : 'rgba(255, 255, 255, 0.7)',
                  flexShrink: 0
                }} />
                {(isMobile || sidebarExpanded) && (
                  <span style={{ 
                    fontWeight: '600', 
                    fontSize: '13px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden'
                  }}>
                    {item.label}
                  </span>
                )}
              </div>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div style={{ padding: (isMobile || sidebarExpanded) ? '16px' : '12px' }}>
          <button
            onClick={logout}
            style={{
              width: '100%',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#ef4444',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: (isMobile || sidebarExpanded) ? '10px 12px' : '10px 8px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: (isMobile || sidebarExpanded) ? '8px' : '0',
              fontWeight: '600',
              fontSize: (isMobile || sidebarExpanded) ? '12px' : '0',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <LogOut style={{ 
              width: (isMobile || sidebarExpanded) ? '14px' : '16px', 
              height: (isMobile || sidebarExpanded) ? '14px' : '16px',
              flexShrink: 0
            }} />
            {(isMobile || sidebarExpanded) && (
              <span style={{ whiteSpace: 'nowrap' }}>Sign Out</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        width: isMobile ? '100%' : 'auto'
      }}>
        {/* Top Bar */}
        <div className="card" style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(30px)',
          border: 'none',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: isMobile ? '12px' : '20px 24px',
          borderRadius: 0,
          width: '100%',
          boxSizing: 'border-box',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    padding: '6px',
                    cursor: 'pointer',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Menu size={14} />
                </button>
              )}
              <div>
                <h2 className="gradient-text" style={{
                  fontSize: isMobile ? '18px' : '24px',
                  fontWeight: '800',
                  margin: 0
                }}>
                  {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h2>
                {!isMobile && (
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: '4px 0 0 0', fontSize: '12px' }}>
                    {new Date().toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative' }}>
                <div 
                  ref={bellRef}
                  onClick={() => setShowNotifications(!showNotifications)}
                  style={{
                    position: 'relative',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <Bell style={{ width: '16px', height: '16px', color: 'rgba(255, 255, 255, 0.8)' }} />
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    width: '6px',
                    height: '6px',
                    background: '#ef4444',
                    borderRadius: '50%'
                  }}></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '0',
          minHeight: 0,
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box'
        }}>
          {children}
        </div>
      </div>
      
      {/* Notification Popup */}
      {showNotifications && (
        <div 
          ref={notificationRef}
          className="card"
          style={{
            position: 'fixed',
            top: '80px',
            right: '40px',
            width: '20px',
            maxHeight: '150px',
            zIndex: 999999,
            overflow: 'hidden',
            padding: 0
          }}
        >
          <div style={{ padding: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: 'white' }}>Visa Expiry Alerts</h3>
          </div>
          <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
            {(() => {
              const allAppsData = localStorage.getItem('allVisaApplications')
              if (allAppsData) {
                const parsedApps = JSON.parse(allAppsData)
                const alerts = parsedApps.filter(app => {
                  if (app.h1bDetails && app.h1bDetails.endDate) {
                    const daysLeft = Math.ceil((new Date(app.h1bDetails.endDate) - new Date()) / (1000 * 60 * 60 * 24))
                    return daysLeft <= 10 && daysLeft > 0
                  }
                  return false
                }).map(app => {
                  const daysLeft = Math.ceil((new Date(app.h1bDetails.endDate) - new Date()) / (1000 * 60 * 60 * 24))
                  return { ...app, daysLeft }
                })
                
                return alerts.length > 0 ? (
                  alerts.map((app, index) => (
                    <div key={index} style={{ 
                      padding: '10px 12px', 
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      background: app.daysLeft <= 3 ? 'rgba(239, 68, 68, 0.1)' : app.daysLeft <= 7 ? 'rgba(245, 158, 11, 0.1)' : 'rgba(59, 130, 246, 0.1)'
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: '600', color: 'white' }}>
                        {app.personalDetails.firstName} {app.personalDetails.lastName}
                      </div>
                      <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.7)', margin: '2px 0' }}>
                        {app.personalDetails.email}
                      </div>
                      <div style={{ 
                        fontSize: '11px', 
                        fontWeight: '600',
                        color: app.daysLeft <= 3 ? '#ef4444' : app.daysLeft <= 7 ? '#f59e0b' : '#6366f1',
                        margin: '4px 0 0 0'
                      }}>
                        ⚠️ {app.daysLeft} days until visa expiry
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '12px', textAlign: 'center' }}>
                    <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>No urgent visa expiry alerts</p>
                  </div>
                )
              } else {
                return (
                  <div style={{ padding: '12px', textAlign: 'center' }}>
                    <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.7)', fontSize: '12px' }}>No visa applications found</p>
                  </div>
                )
              }
            })()} 
          </div>
        </div>
      )}
    </div>
  )
}

export default Layout