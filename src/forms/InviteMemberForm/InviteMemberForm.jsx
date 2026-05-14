import '../form.css'

export function InviteMemberForm({ familyName, onCancel, onSubmit }) {
  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    onSubmit({
      id: `invite-${Date.now()}`,
      firstName: formData.get('firstName') || 'Invité',
      lastName: '',
      email: formData.get('email'),
      birthDate: '',
      role: formData.get('role'),
      status: 'Invitation envoyée',
    })
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      <p className="form-context">Invitation vers : {familyName}</p>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="invite-first-name">Prénom</label>
          <input id="invite-first-name" name="firstName" type="text" />
        </div>
        <div className="form-field">
          <label htmlFor="invite-email">Email</label>
          <input id="invite-email" name="email" type="email" required />
        </div>
        <div className="form-field">
          <label htmlFor="invite-role">Rôle prévu</label>
          <select id="invite-role" name="role" defaultValue="Membre">
            <option>Parent</option>
            <option>Membre</option>
            <option>Enfant</option>
          </select>
        </div>
      </div>
      <div className="form-actions">
        <button
          className="form-button form-button-secondary"
          type="button"
          onClick={onCancel}
        >
          Annuler
        </button>
        <button className="form-button" type="submit">
          Inviter
        </button>
      </div>
    </form>
  )
}
