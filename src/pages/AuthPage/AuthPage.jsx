import { useState } from 'react'
import { FaDoorOpen, FaHouseChimney, FaUserPlus } from 'react-icons/fa6'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Logo } from '../../components/Logo/Logo.jsx'
import { useAuth } from '../../providers/AuthProvider.jsx'
import '../../forms/form.css'
import './AuthPage.css'

export function LoginPage() {
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setError('')
    setIsSubmitting(true)
    try {
      await login({
        email: formData.get('email'),
        password: formData.get('password'),
      })
      navigate(location.state?.from?.pathname ?? '/dashboard', { replace: true })
    } catch (loginError) {
      setError(loginError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      icon={<FaDoorOpen aria-hidden="true" />}
      title="Connexion"
      subtitle="Retrouve ton QG Domiz."
    >
      <form className="app-form" onSubmit={handleSubmit}>
        {error && <p className="auth-alert">{error}</p>}
        <div className="form-field">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" name="email" type="email" required />
        </div>
        <div className="form-field">
          <label htmlFor="login-password">Mot de passe</label>
          <input id="login-password" name="password" type="password" required />
        </div>
        <div className="form-actions">
          <Link className="auth-link" to="/inscription">
            Rejoindre Domiz
          </Link>
          <button className="form-button" type="submit" disabled={isSubmitting}>
            Connexion
          </button>
        </div>
      </form>
    </AuthShell>
  )
}

export function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const password = formData.get('password')
    const passwordConfirmation = formData.get('passwordConfirmation')

    setError('')
    if (password !== passwordConfirmation) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setIsSubmitting(true)
    try {
      await register({
        email: formData.get('email'),
        password,
        passwordConfirmation,
        birthDate: formData.get('birthDate'),
      })
      navigate('/dashboard', { replace: true })
    } catch (registerError) {
      setError(registerError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AuthShell
      icon={<FaUserPlus aria-hidden="true" />}
      title="Rejoindre Domiz"
      subtitle="Crée ton compte en quelques champs."
    >
      <form className="app-form" onSubmit={handleSubmit}>
        {error && <p className="auth-alert">{error}</p>}
        <div className="form-field">
          <label htmlFor="register-email">Email</label>
          <input id="register-email" name="email" type="email" required />
        </div>
        <div className="form-field">
          <label htmlFor="register-birth-date">Date de naissance</label>
          <input id="register-birth-date" name="birthDate" type="date" required />
        </div>
        <div className="form-field">
          <label htmlFor="register-password">Mot de passe</label>
          <input
            id="register-password"
            name="password"
            type="password"
            minLength={8}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="register-password-confirmation">
            Confirmer le mot de passe
          </label>
          <input
            id="register-password-confirmation"
            name="passwordConfirmation"
            type="password"
            minLength={8}
            required
          />
        </div>
        <div className="form-actions">
          <Link className="auth-link" to="/connexion">
            Déjà un compte
          </Link>
          <button className="form-button" type="submit" disabled={isSubmitting}>
            Créer le compte
          </button>
        </div>
      </form>
    </AuthShell>
  )
}

function AuthShell({ children, icon, subtitle, title }) {
  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="auth-title">
        <Link className="brand-link" to="/" aria-label="Accueil Domiz">
          <Logo />
        </Link>
        <div className="auth-heading">
          <p>
            <FaHouseChimney aria-hidden="true" />
            Compte Domiz
          </p>
          <h1 id="auth-title">
            {icon}
            {title}
          </h1>
          <span>{subtitle}</span>
        </div>
        {children}
      </section>
    </main>
  )
}
