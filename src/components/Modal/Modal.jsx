import { FaXmark } from 'react-icons/fa6'
import './Modal.css'

export function Modal({ children, onClose, title }) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={onClose}
    >
      <section
        className="modal-panel"
        aria-labelledby="modal-title"
        aria-modal="true"
        role="dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button type="button" aria-label="Fermer" onClick={onClose}>
            <FaXmark aria-hidden="true" />
          </button>
        </header>
        {children}
      </section>
    </div>
  )
}
