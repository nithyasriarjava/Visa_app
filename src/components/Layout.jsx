import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, FileText, Shield, LogOut, Home, Bell, Menu, ChevronLeft, X, Plane, BarChart3, Settings } from 'lucide-react'

const Layout = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const activeTab = location.pathname.slice(1) || 'profile'
  const { user, logout } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(window.innerWidth > 768)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const notificationRef = useRef(null)
  const bellRef = useRef(null)
  const settingsRef = useRef(null)
  const settingsButtonRef = useRef(null)

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
      if (showSettings && 
          settingsRef.current && 
          !settingsRef.current.contains(event.target) &&
          settingsButtonRef.current &&
          !settingsButtonRef.current.contains(event.target)) {
        setShowSettings(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showNotifications, showSettings])

  const menuItems = [
    { id: 'profile', label: 'Dashboard', icon: BarChart3 },
    { id: 'visa-apply', label: 'Apply for Visa', icon: FileText },
    ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: Shield }] : [])
  ]

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[998] backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'w-[280px] min-w-[280px]' : (sidebarExpanded ? 'w-[280px] min-w-[280px]' : 'w-[70px] min-w-[70px]')}
        bg-white border-r border-slate-200 flex flex-col transition-all duration-300 overflow-hidden
        ${isMobile ? 'fixed' : 'relative'}
        ${isMobile ? (sidebarOpen ? 'left-0' : '-left-[280px]') : 'left-0'}
        ${isMobile ? 'top-0 h-screen' : 'top-auto h-auto'}
        z-[999] shadow-lg shadow-slate-900/10
      `}>
        {/* Header */}
        <div className={`bg-gradient-to-r from-slate-800 to-slate-900 flex items-center relative
          ${(isMobile || sidebarExpanded) ? 'p-5 justify-between' : 'p-4 justify-center'}
        `}>
          {(isMobile || sidebarExpanded) ? (
            <>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-bold text-white m-0">
                    VisaFlow
                  </h1>
                  <p className="text-xs text-slate-300 m-0">
                    Travel Management
                  </p>
                </div>
              </div>
              <button
                onClick={() => isMobile ? setSidebarOpen(false) : setSidebarExpanded(false)}
                className="bg-white/10 border border-white/20 rounded-lg p-2 cursor-pointer text-white flex items-center justify-center transition-all duration-300 hover:bg-white/20"
              >
                {isMobile ? <X size={16} /> : <ChevronLeft size={16} />}
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarExpanded(true)}
              className="bg-white/10 border border-white/20 rounded-lg p-2.5 cursor-pointer text-white flex items-center justify-center transition-all duration-300 hover:bg-white/20"
            >
              <Menu size={18} />
            </button>
          )}
        </div>

        {/* User Info */}
        {(isMobile || sidebarExpanded) && (
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="bg-slate-700 w-10 h-10 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 m-0 text-xs">
                  {user?.firstName || 'User'} {user?.lastName || ''}
                </p>
                <p className="text-xs text-slate-600 m-0 mb-1">
                  {user?.email}
                </p>
                <span className={`inline-flex items-center px-2.5 py-1 text-xs rounded-full font-medium
                  ${user?.role === 'admin' 
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-sm' 
                    : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-sm'}
                `}>
                  {user?.role === 'admin' ? '👑 Admin' : '✈️ Traveler'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="py-6 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <div
                key={item.id}
                onClick={() => {
                  if (item.id === 'visa-apply') {
                    localStorage.removeItem('editingPersonData')
                    localStorage.removeItem('editingPersonIndex')
                  }
                  navigate(`/${item.id}`)
                  if (isMobile) setSidebarOpen(false)
                }}
                className={`cursor-pointer transition-all duration-300 flex items-center gap-4 font-medium group
                  ${(isMobile || sidebarExpanded) ? 'mx-4 p-3 rounded-xl justify-start' : 'mx-3 p-3 rounded-xl justify-center'}
                  ${isActive 
                    ? 'bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg shadow-slate-800/25' 
                    : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-800'
                  }
                `}
              >
                <Icon className={`flex-shrink-0 transition-all duration-300
                  ${(isMobile || sidebarExpanded) ? 'w-5 h-5' : 'w-6 h-6'}
                  ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}
                `} />
                {(isMobile || sidebarExpanded) && (
                  <span className="font-semibold text-xs whitespace-nowrap overflow-hidden">
                    {item.label}
                  </span>
                )}
              </div>
            )
          })}
        </nav>

        {/* Logout Button */}
        <div className={`${(isMobile || sidebarExpanded) ? 'p-4' : 'p-3'} border-t border-slate-200/50`}>
          <button
            onClick={logout}
            className={`w-full bg-red-50/80 hover:bg-red-100/80 text-red-600 hover:text-red-700 border border-red-200/50 transition-all duration-300 flex items-center justify-center font-medium rounded-xl shadow-sm hover:shadow-md
              ${(isMobile || sidebarExpanded) ? 'p-3 gap-3' : 'p-3'}
            `}
          >
            <LogOut className={`flex-shrink-0
              ${(isMobile || sidebarExpanded) ? 'w-4 h-4' : 'w-5 h-5'}
            `} />
            {(isMobile || sidebarExpanded) && (
              <span className="text-xs font-semibold">Sign Out</span>
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
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm" style={{
          padding: isMobile ? '16px 20px' : '20px 32px',
          width: '100%',
          boxSizing: 'border-box',
          flexShrink: 0
        }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isMobile && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl p-2.5 transition-all duration-200"
                >
                  <Menu className="w-5 h-5 text-slate-600" />
                </button>
              )}
              <div>
                <h2 className={`font-bold text-slate-800 m-0
                  ${isMobile ? 'text-xl' : 'text-2xl'}
                `}>
                  {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h2>
                {!isMobile && (
                  <p className="text-slate-500 m-0 mt-1 text-sm">
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
            <div className="flex items-center gap-3">
              <div className="relative">
                <button 
                  ref={bellRef}
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl p-3 transition-all duration-200 group"
                >
                  <Bell className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full border-2 border-white"></span>
                </button>
              </div>
              <div className="relative">
                <button 
                  ref={settingsButtonRef}
                  onClick={() => setShowSettings(!showSettings)}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl p-3 transition-all duration-200 group"
                >
                  <Settings className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-50/50 to-slate-100/30" style={{
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
          className="fixed bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden"
          style={{
            top: '90px',
            right: '32px',
            width: '360px',
            maxHeight: '480px',
            zIndex: 999999
          }}
        >
          <div className="p-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <h3 className="m-0 text-lg font-bold text-slate-800">Notifications</h3>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-slate-400" />
              </div>
              <p className="m-0 text-slate-500 text-sm font-medium">No new notifications</p>
              <p className="m-0 text-slate-400 text-xs mt-1">We'll notify you when something important happens</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Settings Popup */}
      {showSettings && (
        <div 
          ref={settingsRef}
          className="fixed bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/50 overflow-hidden"
          style={{
            top: '90px',
            right: '32px',
            width: '280px',
            zIndex: 999999
          }}
        >
          <div className="p-4 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <h3 className="m-0 text-base font-bold text-slate-800">Settings</h3>
            </div>
          </div>
          <div className="p-2">
            <button 
              onClick={() => { setShowSettings(false); navigate('/profile'); }}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Profile Settings
            </button>
            <button 
              onClick={() => { setShowSettings(false); alert('Account Preferences - Coming Soon!'); }}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Account Preferences
            </button>
            <button 
              onClick={() => { setShowSettings(false); alert('Notification Settings - Coming Soon!'); }}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Notification Settings
            </button>
            <button 
              onClick={() => { setShowSettings(false); alert('Privacy & Security - Coming Soon!'); }}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Privacy & Security
            </button>
            <div className="border-t border-slate-200 my-2"></div>
            <button 
              onClick={() => { setShowSettings(false); alert('Help & Support - Contact us at support@visaflow.com'); }}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Help & Support
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Layout