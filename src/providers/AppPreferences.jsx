import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const translations = {
  fr: {
    dashboard: 'Dashboard',
    dashboardTitle: 'Tableau de bord familial',
    settings: 'Réglages',
    family: 'Famille',
    tasks: 'Tâches',
    categories: 'Catégories',
    rewards: 'Récompenses',
    language: 'Langue',
    theme: 'Thème',
    darkMode: 'Mode sombre',
    lightMode: 'Mode clair',
    me: 'Moi',
    myFamily: 'Ma famille',
    monthTeam: 'Équipe du mois',
    currentMonth: 'Mois en cours',
    taskTimeline: 'Frise d’avancement des tâches',
    lateTasks: 'Tâches en retard',
  },
  it: {
    dashboard: 'Dashboard',
    dashboardTitle: 'Cruscotto famigliare',
    settings: 'Impostazioni',
    family: 'Famiglia',
    tasks: 'Attività',
    categories: 'Categorie',
    rewards: 'Ricompense',
    language: 'Lingua',
    theme: 'Tema',
    darkMode: 'Modalità scura',
    lightMode: 'Modalità chiara',
    me: 'Io',
    myFamily: 'La mia famiglia',
    monthTeam: 'Squadra del mese',
    currentMonth: 'Mese in corso',
    taskTimeline: 'Timeline delle attività',
    lateTasks: 'Attività in ritardo',
  },
  de: {
    dashboard: 'Dashboard',
    dashboardTitle: 'Familien-Dashboard',
    settings: 'Einstellungen',
    family: 'Familie',
    tasks: 'Aufgaben',
    categories: 'Kategorien',
    rewards: 'Belohnungen',
    language: 'Sprache',
    theme: 'Theme',
    darkMode: 'Dunkelmodus',
    lightMode: 'Hellmodus',
    me: 'Ich',
    myFamily: 'Meine Familie',
    monthTeam: 'Team des Monats',
    currentMonth: 'Aktueller Monat',
    taskTimeline: 'Aufgaben-Fortschritt',
    lateTasks: 'Überfällige Aufgaben',
  },
  en: {
    dashboard: 'Dashboard',
    dashboardTitle: 'Family dashboard',
    settings: 'Settings',
    family: 'Family',
    tasks: 'Tasks',
    categories: 'Categories',
    rewards: 'Rewards',
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark mode',
    lightMode: 'Light mode',
    me: 'Me',
    myFamily: 'My family',
    monthTeam: 'Team of the month',
    currentMonth: 'Current month',
    taskTimeline: 'Task progress timeline',
    lateTasks: 'Late tasks',
  },
}

const languageNames = {
  fr: 'FR',
  it: 'IT',
  de: 'DE',
  en: 'EN',
}

const AppPreferencesContext = createContext(null)

export function AppPreferencesProvider({ children }) {
  const [language, setLanguage] = useState('fr')
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const value = useMemo(
    () => ({
      language,
      languageNames,
      languages: Object.keys(translations),
      setLanguage,
      setTheme,
      t: translations[language],
      theme,
      toggleTheme: () =>
        setTheme((currentTheme) =>
          currentTheme === 'dark' ? 'light' : 'dark',
        ),
    }),
    [language, theme],
  )

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  )
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext)

  if (!context) {
    throw new Error('useAppPreferences must be used inside AppPreferencesProvider')
  }

  return context
}
