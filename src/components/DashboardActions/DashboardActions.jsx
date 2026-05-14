import { useState } from 'react'
import {
  FaChevronDown,
  FaGear,
  FaGlobe,
  FaMoon,
  FaSun,
} from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { useAppPreferences } from '../../providers/AppPreferences.jsx'
import './DashboardActions.css'

const settingsLinks = [
  { key: 'family', to: '/famille' },
  { key: 'tasks', to: '#' },
  { key: 'categories', to: '#' },
  { key: 'rewards', to: '#' },
]

export function DashboardActions() {
  const {
    language,
    languageNames,
    languages,
    setLanguage,
    t,
    theme,
    toggleTheme,
  } = useAppPreferences()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [languageOpen, setLanguageOpen] = useState(false)
  const isDark = theme === 'dark'

  return (
    <div className="dashboard-actions">
      <div className="action-menu">
        <button
          className="icon-action"
          type="button"
          aria-expanded={settingsOpen}
          aria-haspopup="menu"
          aria-label={t.settings}
          onClick={() => {
            setSettingsOpen((isOpen) => !isOpen)
            setLanguageOpen(false)
          }}
        >
          <FaGear aria-hidden="true" />
          <FaChevronDown className="chevron" aria-hidden="true" />
        </button>

        {settingsOpen && (
          <div className="dropdown-menu settings-menu" role="menu">
            {settingsLinks.map((link) => (
              <Link
                key={link.key}
                to={link.to}
                role="menuitem"
                onClick={() => setSettingsOpen(false)}
              >
                {t[link.key]}
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="action-menu">
        <button
          className="language-action"
          type="button"
          aria-expanded={languageOpen}
          aria-haspopup="menu"
          aria-label={t.language}
          onClick={() => {
            setLanguageOpen((isOpen) => !isOpen)
            setSettingsOpen(false)
          }}
        >
          <FaGlobe aria-hidden="true" />
          <span>{languageNames[language]}</span>
          <FaChevronDown className="chevron" aria-hidden="true" />
        </button>

        {languageOpen && (
          <div className="dropdown-menu language-menu" role="menu">
            {languages.map((languageCode) => (
              <button
                key={languageCode}
                type="button"
                role="menuitem"
                aria-current={languageCode === language ? 'true' : undefined}
                onClick={() => {
                  setLanguage(languageCode)
                  setLanguageOpen(false)
                }}
              >
                {languageNames[languageCode]}
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        className="icon-action"
        type="button"
        aria-label={isDark ? t.lightMode : t.darkMode}
        onClick={toggleTheme}
      >
        {isDark ? <FaSun aria-hidden="true" /> : <FaMoon aria-hidden="true" />}
      </button>
    </div>
  )
}
