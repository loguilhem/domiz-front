import { Link } from 'react-router-dom'
import { FaBolt, FaDoorOpen, FaHouseChimney, FaStar } from 'react-icons/fa6'
import { Logo } from '../../components/Logo/Logo.jsx'
import './HomePage.css'

export function HomePage() {
  return (
    <main className="home-page">
      <section className="manga-hero" aria-labelledby="home-title">
        <div className="speed-lines" aria-hidden="true"></div>
        <div className="ink-burst ink-burst-left" aria-hidden="true"></div>
        <div className="ink-burst ink-burst-right" aria-hidden="true"></div>

        <nav className="topbar" aria-label="Navigation principale">
          <Link className="brand-link" to="/" aria-label="Accueil Domiz">
            <Logo />
          </Link>
          <div className="topbar-actions">
            <Link className="topbar-link" to="/connexion">
              Connexion
            </Link>
            <Link className="topbar-link topbar-link-primary" to="/inscription">
              Rejoindre Domiz
            </Link>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="manga-tag">
              <FaBolt aria-hidden="true" />
              Mission maison active
            </p>
            <h1 id="home-title">
              Ton QG domestique passe en mode manga.
            </h1>
            <p className="hero-text">
              Domiz rassemble ton foyer, tes routines et tes petits plans du
              quotidien dans une interface qui claque.
            </p>
            <div className="hero-actions">
              <Link className="login-button" to="/connexion">
                <FaDoorOpen aria-hidden="true" />
                <span>Connexion</span>
              </Link>
              <Link className="login-button join-button" to="/inscription">
                Rejoindre Domiz
              </Link>
            </div>
          </div>

          <div className="poster" aria-label="Logo Domiz style manga">
            <div className="poster-frame">
              <div className="action-label action-label-top">
                <FaStar aria-hidden="true" />
                Start
              </div>
              <div className="domiz-logo">
                <span className="logo-kicker">Do</span>
                <span className="logo-main">miz</span>
              </div>
              <div className="house-emblem" aria-hidden="true">
                <FaHouseChimney />
              </div>
              <div className="action-label action-label-bottom">
                Home power
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
