import { Link } from 'react-router-dom'
import { Logo } from '../../components/Logo/Logo.jsx'
import './LegalMentionsPage.css'

export function LegalMentionsPage() {
  return (
    <main className="legal-page">
      <section className="legal-panel" aria-labelledby="legal-title">
        <Link className="brand-link" to="/" aria-label="Accueil Domiz">
          <Logo />
        </Link>
        <h1 id="legal-title">Mentions légales</h1>
        <p>
          Domiz est un projet créé pour le fun. Les informations légales
          complètes seront ajoutées avant une mise en production publique.
        </p>
        <Link className="legal-back-link" to="/">
          Retour accueil
        </Link>
      </section>
    </main>
  )
}
