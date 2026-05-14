import '../form.css'

export function FamilyForm({ onCancel, onSubmit }) {
  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    onSubmit({
      id: `family-${Date.now()}`,
      name: formData.get('name'),
      members: [],
    })
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="family-name">Nom de la famille</label>
        <input
          id="family-name"
          name="name"
          type="text"
          placeholder="Maison principale"
          required
        />
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
          Créer
        </button>
      </div>
    </form>
  )
}
