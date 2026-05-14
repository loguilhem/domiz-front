import { Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer/Footer.jsx'
import { DashboardPage } from './pages/DashboardPage/DashboardPage.jsx'
import { FamilyPage } from './pages/FamilyPage/FamilyPage.jsx'
import { HomePage } from './pages/HomePage/HomePage.jsx'
import { LegalMentionsPage } from './pages/LegalMentionsPage/LegalMentionsPage.jsx'

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/famille" element={<FamilyPage />} />
        <Route path="/mentions-legales" element={<LegalMentionsPage />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App
