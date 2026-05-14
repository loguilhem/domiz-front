import { Link } from 'react-router-dom'
import './Footer.css'

export function Footer() {
  return (
    <footer className="site-footer">
      <p>made for fun by geatvibe.ch</p>
      <Link to="/mentions-legales">mentions légales</Link>
    </footer>
  )
}
