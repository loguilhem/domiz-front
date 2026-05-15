import { Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer/Footer.jsx'
import {
  ProtectedRoute,
  PublicOnlyRoute,
} from './components/ProtectedRoute/ProtectedRoute.jsx'
import { DashboardPage } from './pages/DashboardPage/DashboardPage.jsx'
import { FamilyPage } from './pages/FamilyPage/FamilyPage.jsx'
import { HomePage } from './pages/HomePage/HomePage.jsx'
import { LegalMentionsPage } from './pages/LegalMentionsPage/LegalMentionsPage.jsx'
import { LoginPage, RegisterPage } from './pages/AuthPage/AuthPage.jsx'
import { CategoryPage } from './pages/CategoryPage/CategoryPage.jsx'
import { TaskPage } from './pages/TaskPage/TaskPage.jsx'

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/connexion"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/inscription"
          element={
            <PublicOnlyRoute>
              <RegisterPage />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/famille"
          element={
            <ProtectedRoute>
              <FamilyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/taches"
          element={
            <ProtectedRoute>
              <TaskPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mentions-legales"
          element={
            <ProtectedRoute>
              <LegalMentionsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
