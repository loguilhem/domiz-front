import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../providers/AuthProvider.jsx'

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/connexion" replace state={{ from: location }} />
  }

  return children
}

export function PublicOnlyRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
