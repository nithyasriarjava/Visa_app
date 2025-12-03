import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { User, FileText, Shield, LogOut, Home, Bell, Menu, ChevronLeft, X, Plane, BarChart3, Settings } from 'lucide-react'

const Layout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const activeTab = location.pathname.replace(/^\//, '') || 'profile'
  const { user, logout } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [notificationUsers, setNotificationUsers] = useState([])
  const [underConstructionBanner, setUnderConstructionBanner] = useState(false)
  const [underConstructionTooltip, setUnderConstructionTooltip] = useState('')
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

  // Listen for profile data updates
  useEffect(() => {
    const handleProfileDataUpdate = (event) => {
      const profileData = event.detail
      console.log('Profile data received in Layout:', profileData)
      
      if (profileData && profileData.length > 0) {
        const validUsers = profileData.filter(u => {
          const status = (u.h1b_status || "").toLowerCase().trim()
          if (status !== "active") return false

          const start = u.h1b_start_date
          const end = u.h1b_end_date

          const hasStart = start && !isNaN(new Date(start).getTime())
          const hasEnd = end && !isNaN(new Date(end).getTime())

          return hasStart || hasEnd
        })
        
        console.log('Valid notification users:', validUsers)
        setNotificationUsers(validUsers)
      } else {
        setNotificationUsers([])
      }
    }

    window.addEventListener('profileDataUpdated', handleProfileDataUpdate)
    
    return () => {
      window.removeEventListener('profileDataUpdated', handleProfileDataUpdate)
    }
  }, [])

  // Calculate days remaining/passed for a date
  const calculateDays = (dateStr) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return null

    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 0) return `${diffDays} days left`
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`
    return 'Today'
  }

  const menuItems = [
    { id: 'profile', label: 'Dashboard', icon: BarChart3 },
    { id: 'visa-apply', label: 'Apply for Visa', icon: FileText },
    ...(user?.role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: Shield }] : [])
  ]

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Under Construction Banner */}
      {underConstructionBanner && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2
                  bg-yellow-500 text-white text-xs font-semibold 
                  px-3 py-1 rounded-md shadow-md 
                  w-auto z-[9999]">
          Under Construction
        </div>
      )}


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
                  console.log('navigating to', item.id)
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
            onClick={() => setShowLogoutConfirm(true)}
            className={`w-full bg-red-50/80 hover:bg-red-100/80 text-red-600 hover:text-red-700 border border-red-200/50 transition-all duration-300 flex items-center justify-center font-medium rounded-xl shadow-sm hover:shadow-md cursor-pointer
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
                  className="relative bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl p-3 transition-all duration-200 group cursor-pointer"
                >
                  <Bell className="w-5 h-5 text-slate-600 group-hover:text-slate-800" />
                  {notificationUsers.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full border-2 border-white"></span>
                  )}
                </button>
              </div>
              <div className="relative">
                <button
                  ref={settingsButtonRef}
                  onClick={() => setShowSettings(!showSettings)}
                  className="bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl p-3 transition-all duration-200 group cursor-pointer"
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
          <Outlet />
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
            {notificationUsers.length > 0 ? (
              <div className="p-4">
                {notificationUsers.map((user, index) => {
                  const firstName = user.first_name
                  const lastName = user.last_name
                  const startDate = user.h1b_start_date
                  const endDate = user.h1b_end_date

                  return (
                    <div key={user.customer_id || index} className="p-3 border-b border-slate-200 last:border-b-0">
                      <p className="text-sm font-medium text-slate-800 mb-1">
                        {firstName} {lastName}
                      </p>
                      <div className="text-xs text-slate-600 space-y-1">
                        {startDate && (
                          <p className="mb-1">
                            Start: {startDate} ({calculateDays(startDate)})
                          </p>
                        )}
                        {endDate && (
                          <p>
                            End: {endDate} ({calculateDays(endDate)})
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-slate-400" />
                </div>
                <p className="m-0 text-slate-500 text-sm font-medium">No new notifications</p>
                <p className="m-0 text-slate-400 text-xs mt-1">We'll notify you when something important happens</p>
              </div>
            )}
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
          <div className="p-2 relative">
            <button
              onClick={() => { setShowSettings(false); navigate('/profile'); }}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Profile Settings
            </button>
            <button
              onClick={() => {
                setUnderConstructionBanner(true)
                setUnderConstructionTooltip('Account Preferences')
                setTimeout(() => {
                  setUnderConstructionBanner(false)
                  setUnderConstructionTooltip('')
                }, 3000)
              }}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative"
            >
              Account Preferences
              {underConstructionTooltip === 'Account Preferences' && (
                <div className="absolute left-full top-0 ml-2 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded shadow-lg whitespace-nowrap z-[999999]">
                  Under Construction
                </div>
              )}
            </button>
            <button
              onClick={() => {
                setUnderConstructionBanner(true)
                setUnderConstructionTooltip('Notification Settings')
                setTimeout(() => {
                  setUnderConstructionBanner(false)
                  setUnderConstructionTooltip('')
                }, 3000)
              }}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative"
            >
              Notification Settings
              {underConstructionTooltip === 'Notification Settings' && (
                <div className="absolute left-full top-0 ml-2 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded shadow-lg whitespace-nowrap z-[999999]">
                  Under Construction
                </div>
              )}
            </button>
            <button
              onClick={() => {
                setUnderConstructionBanner(true)
                setUnderConstructionTooltip('Privacy & Security')
                setTimeout(() => {
                  setUnderConstructionBanner(false)
                  setUnderConstructionTooltip('')
                }, 3000)
              }}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative"
            >
              Privacy & Security
              {underConstructionTooltip === 'Privacy & Security' && (
                <div className="absolute left-full top-0 ml-2 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded shadow-lg whitespace-nowrap z-[999999]">
                  Under Construction
                </div>
              )}
            </button>
            <div className="border-t border-slate-200 my-2"></div>
            <button
              onClick={() => {
                setUnderConstructionBanner(true)
                setUnderConstructionTooltip('Help & Support')
                setTimeout(() => {
                  setUnderConstructionBanner(false)
                  setUnderConstructionTooltip('')
                }, 3000)
              }}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative"
            >
              Help & Support
              {underConstructionTooltip === 'Help & Support' && (
                <div className="absolute left-full top-0 ml-2 bg-yellow-500 text-white text-xs px-1 py-0.5 rounded shadow-lg whitespace-nowrap z-[999999]">
                  Under Construction
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999999] backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
              Are you sure you want to sign out?
            </h3>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false)
                  logout()
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Layout