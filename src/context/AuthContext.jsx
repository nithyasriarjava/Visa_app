import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, googleUserInfo = null) => {
    try {
      // Get registered users
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const foundUser = users.find(u => u.email === email)
      
      // Check if email is registered
      if (!foundUser) {
        return { 
          success: false, 
          error: `Email "${email}" is not registered. Please create an account first with this email address.` 
        }
      }

      // Create authenticated user with Google info
      const authenticatedUser = {
        ...foundUser,
        firstName: googleUserInfo?.firstName || foundUser.firstName,
        lastName: googleUserInfo?.lastName || foundUser.lastName,
        picture: googleUserInfo?.picture || null,
        googleId: googleUserInfo?.googleId || null,
        authMethod: 'google',
        lastLogin: new Date().toISOString()
      }

      // Save authenticated user
      setUser(authenticatedUser)
      localStorage.setItem('currentUser', JSON.stringify(authenticatedUser))
      
      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Authentication failed. Please try again.' }
    }
  }

  const register = async (userData) => {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Check if user already exists
      const existingUser = users.find(u => u.email === userData.email)
      if (existingUser) {
        return { success: false, error: 'An account with this email already exists.' }
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        role: 'user',
        createdAt: new Date().toISOString(),
        hasCompletedProfile: false
      }

      // Save to users list
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))

      // Auto-login after registration
      setUser(newUser)
      localStorage.setItem('currentUser', JSON.stringify(newUser))

      return { success: true }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: 'Registration failed. Please try again.' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}