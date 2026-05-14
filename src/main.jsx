import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppPreferencesProvider } from './providers/AppPreferences.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppPreferencesProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AppPreferencesProvider>
  </StrictMode>,
)
