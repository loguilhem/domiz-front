import '../form.css'

export function ProfileForm({ initialValues, onCancel, onSubmit }) {
  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    onSubmit({
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      birthDate: formData.get('birthDate'),
      password: formData.get('password'),
    })
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="profile-first-name">Prénom</label>
          <input
            id="profile-first-name"
            name="firstName"
            type="text"
            defaultValue={initialValues.firstName}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="profile-last-name">Nom</label>
          <input
            id="profile-last-name"
            name="lastName"
            type="text"
            defaultValue={initialValues.lastName}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="profile-email">Email</label>
          <input
            id="profile-email"
            name="email"
            type="email"
            defaultValue={initialValues.email}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="profile-birth-date">Date de naissance</label>
          <input
            id="profile-birth-date"
            name="birthDate"
            type="date"
            defaultValue={initialValues.birthDate}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="profile-password">Mot de passe</label>
          <input
            id="profile-password"
            name="password"
            type="password"
            placeholder="Nouveau mot de passe"
          />
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
