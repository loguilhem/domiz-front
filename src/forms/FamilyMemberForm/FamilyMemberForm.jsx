import '../form.css'

export function FamilyMemberForm({ familyName, initialValues, onCancel, onSubmit }) {
  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    onSubmit({
      id: initialValues?.id,
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      birthDate: formData.get('birthDate'),
      role: formData.get('role'),
      status: 'Membre local',
    })
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      <p className="form-context">Famille active : {familyName}</p>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="member-first-name">Prénom</label>
          <input
            id="member-first-name"
            name="firstName"
            type="text"
            defaultValue={initialValues?.firstName}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="member-last-name">Nom</label>
          <input
            id="member-last-name"
            name="lastName"
            type="text"
            defaultValue={initialValues?.lastName}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="member-email">Email</label>
          <input
            id="member-email"
            name="email"
            type="email"
            defaultValue={initialValues?.email}
          />
        </div>
        <div className="form-field">
          <label htmlFor="member-birth-date">Date de naissance</label>
          <input
            id="member-birth-date"
            name="birthDate"
            type="date"
            defaultValue={initialValues?.birthDate}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="member-role">Rôle</label>
          <select
            id="member-role"
            name="role"
            defaultValue={initialValues?.role ?? 'Membre'}
          >
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
          Enregistrer
        </button>
      </div>
    </form>
  )
}
