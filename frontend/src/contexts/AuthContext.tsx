'use client'

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react'
import Cookies from 'js-cookie'
import { authAPI } from '@/lib/api'
import { User, RegisterData } from '@/types/api.types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = Cookies.get('accessToken')
      const savedUser = Cookies.get('user')

      if (token && savedUser) {
        const userData = JSON.parse(savedUser)
        setUser(userData)

        // Verify token is still valid
        try {
          const response = await authAPI.verifyToken()
          if (response.data.valid) {
            setUser(response.data.user)
          } else {
            throw new Error('Token invalid')
          }
        } catch {
          // Token is invalid, clear auth data
          clearAuthData()
        }
      }
    } catch {
      clearAuthData()
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuthStatus()
  }, [checkAuthStatus])

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password })
      const { user: userData, accessToken, refreshToken } = response.data

      // Store tokens and user data
      Cookies.set('accessToken', accessToken, {
        expires: 1,
        secure: true,
        sameSite: 'strict',
      })
      Cookies.set('refreshToken', refreshToken, {
        expires: 7,
        secure: true,
        sameSite: 'strict',
      })
      Cookies.set('user', JSON.stringify(userData), {
        expires: 7,
        secure: true,
        sameSite: 'strict',
      })

      setUser(userData)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Login failed')
    }
  }

  const register = async (data: RegisterData) => {
    try {
      const response = await authAPI.register(data)
      const { user: userData, accessToken, refreshToken } = response.data

      // Store tokens and user data
      Cookies.set('accessToken', accessToken, {
        expires: 1,
        secure: true,
        sameSite: 'strict',
      })
      Cookies.set('refreshToken', refreshToken, {
        expires: 7,
        secure: true,
        sameSite: 'strict',
      })
      Cookies.set('user', JSON.stringify(userData), {
        expires: 7,
        secure: true,
        sameSite: 'strict',
      })

      setUser(userData)
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      throw new Error(err.response?.data?.message || 'Registration failed')
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch {
      // Even if logout API fails, clear local data
    } finally {
      clearAuthData()
    }
  }

  const clearAuthData = () => {
    Cookies.remove('accessToken')
    Cookies.remove('refreshToken')
    Cookies.remove('user')
    setUser(null)
  }

  const updateUser = (userData: User) => {
    setUser(userData)
    Cookies.set('user', JSON.stringify(userData), {
      expires: 7,
      secure: true,
      sameSite: 'strict',
    })
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
