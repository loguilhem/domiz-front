import { createContext, useContext, useMemo, useState } from 'react'
import { loginAccount, registerAccount } from '../services/api.js'

const AUTH_STORAGE_KEY = 'domiz-auth'

const AuthContext = createContext(null)

function readStoredAuth() {
  try {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY)
    return storedAuth ? JSON.parse(storedAuth) : null
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    return null
  }
}

function storeAuth(auth) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth))
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(readStoredAuth)

  async function login(credentials) {
    const nextAuth = await loginAccount(credentials)
    storeAuth(nextAuth)
    setAuth(nextAuth)
    return nextAuth
  }

  async function register(account) {
    const nextAuth = await registerAccount(account)
    storeAuth(nextAuth)
    setAuth(nextAuth)
    return nextAuth
  }

  function logout() {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setAuth(null)
  }

  const value = useMemo(
    () => ({
      auth,
      isAuthenticated: Boolean(auth?.token),
      login,
      logout,
      register,
      user: auth?.user ?? null,
    }),
    [auth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
