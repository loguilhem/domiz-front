import { useEffect, useMemo, useState } from 'react'
import {
  FaBasketShopping,
  FaBookOpen,
  FaBroom,
  FaHeart,
  FaHouseChimney,
  FaLayerGroup,
  FaPen,
  FaPlus,
  FaShapes,
  FaShirt,
  FaStar,
  FaTag,
  FaTrash,
  FaUtensils,
  FaWandMagicSparkles,
} from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { DashboardActions } from '../../components/DashboardActions/DashboardActions.jsx'
import { Logo } from '../../components/Logo/Logo.jsx'
import { Modal } from '../../components/Modal/Modal.jsx'
import {
  createFamilyCategory,
  deleteCategory,
  fetchFamilies,
  fetchFamilyCategories,
  updateCategory,
} from '../../services/api.js'
import '../../forms/form.css'
import './CategoryPage.css'

const iconOptions = [
  { key: 'tag', label: 'Étiquette', Icon: FaTag },
  { key: 'home', label: 'Maison', Icon: FaHouseChimney },
  { key: 'cleaning', label: 'Ménage', Icon: FaBroom },
  { key: 'meal', label: 'Repas', Icon: FaUtensils },
  { key: 'shopping', label: 'Courses', Icon: FaBasketShopping },
  { key: 'study', label: 'Études', Icon: FaBookOpen },
  { key: 'clothes', label: 'Linge', Icon: FaShirt },
  { key: 'health', label: 'Santé', Icon: FaHeart },
  { key: 'fun', label: 'Fun', Icon: FaStar },
  { key: 'magic', label: 'Spécial', Icon: FaWandMagicSparkles },
]

const fallbackIcon = { key: 'tag', label: 'Étiquette', Icon: FaTag }

const colorOptions = [
  '#2ad7ff',
  '#ffef5a',
  '#ff5b9a',
  '#78f08f',
  '#b28cff',
  '#ff9f43',
  '#ffffff',
  '#101014',
]

function getIconOption(iconKey) {
  return iconOptions.find((option) => option.key === iconKey) ?? fallbackIcon
}

export function CategoryPage() {
  const [families, setFamilies] = useState([])
  const [activeFamilyId, setActiveFamilyId] = useState(null)
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)

  const activeFamily = useMemo(
    () => families.find((family) => family.id === activeFamilyId) ?? families[0],
    [activeFamilyId, families],
  )

  useEffect(() => {
    let ignore = false

    async function loadFamilies() {
      setIsLoading(true)
      setError('')

      try {
        const nextFamilies = await fetchFamilies()
        if (ignore) {
          return
        }

        setFamilies(nextFamilies)
        setActiveFamilyId((currentId) => {
          if (nextFamilies.some((family) => family.id === currentId)) {
            return currentId
          }
          return nextFamilies[0]?.id ?? null
        })
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message)
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    loadFamilies()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false

    async function loadCategories() {
      if (!activeFamilyId) {
        setCategories([])
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const nextCategories = await fetchFamilyCategories(activeFamilyId)
        if (!ignore) {
          setCategories(nextCategories)
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message)
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    loadCategories()

    return () => {
      ignore = true
    }
  }, [activeFamilyId])

  async function handleCreateCategory(category) {
    if (!activeFamily) {
      return
    }

    setIsSaving(true)
    setError('')
    try {
      const createdCategory = await createFamilyCategory(activeFamily.id, category)
      setCategories((currentCategories) => [...currentCategories, createdCategory])
      setModal(null)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleUpdateCategory(category) {
    setIsSaving(true)
    setError('')
    try {
      const updatedCategory = await updateCategory(category)
      setCategories((currentCategories) =>
        currentCategories.map((currentCategory) =>
          currentCategory.id === updatedCategory.id
            ? updatedCategory
            : currentCategory,
        ),
      )
      setModal(null)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteCategory(category) {
    const shouldDelete = window.confirm(`Supprimer la catégorie "${category.name}" ?`)
    if (!shouldDelete) {
      return
    }

    setIsSaving(true)
    setError('')
    try {
      await deleteCategory(category.id)
      setCategories((currentCategories) =>
        currentCategories.filter((currentCategory) => currentCategory.id !== category.id),
      )
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="category-page">
      <header className="category-header">
        <Link className="brand-link" to="/dashboard" aria-label="Dashboard Domiz">
          <Logo />
        </Link>
        <div className="category-header-main">
          <div className="category-title">
            <p>
              <FaLayerGroup aria-hidden="true" />
              Catégories
            </p>
            <h1>Gestion des catégories</h1>
          </div>
          <DashboardActions />
        </div>
      </header>

      {error && <p className="category-alert">{error}</p>}
      {isLoading && <p className="category-alert">Chargement des catégories...</p>}

      <section className="category-panel" aria-labelledby="category-title">
        <div className="panel-heading-row">
          <div>
            <p>Famille active</p>
            <h2 id="category-title">{activeFamily?.name ?? 'Aucune famille'}</h2>
          </div>
          <button
            type="button"
            disabled={!activeFamily || isSaving}
            onClick={() => setModal({ type: 'category' })}
          >
            <FaPlus aria-hidden="true" />
            Créer une catégorie
          </button>
        </div>

        <div className="category-switcher" aria-label="Choisir une famille">
          {families.map((family) => (
            <button
              key={family.id}
              type="button"
              aria-current={family.id === activeFamily?.id ? 'true' : undefined}
              onClick={() => setActiveFamilyId(family.id)}
            >
              <FaHouseChimney aria-hidden="true" />
              {family.name}
            </button>
          ))}
        </div>

        <div className="category-grid">
          {!activeFamily || categories.length === 0 ? (
            <div className="empty-category">
              <FaShapes aria-hidden="true" />
              <p>
                {activeFamily
                  ? 'Aucune catégorie dans cette famille pour le moment.'
                  : 'Crée une famille avant de gérer les catégories.'}
              </p>
            </div>
          ) : (
            categories.map((category) => {
              const { Icon, label } = getIconOption(category.icon)

              return (
                <article className="category-card" key={category.id}>
                  <div
                    className="category-icon"
                    aria-label={label}
                    style={{ '--category-icon-color': category.iconColor }}
                  >
                    <Icon aria-hidden="true" />
                  </div>
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <p>{label}</p>
                  </div>
                  <div className="category-card-actions">
                    <button
                      type="button"
                      disabled={isSaving}
                      aria-label={`Modifier ${category.name}`}
                      onClick={() => setModal({ type: 'edit-category', category })}
                    >
                      <FaPen aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      disabled={isSaving}
                      aria-label={`Supprimer ${category.name}`}
                      onClick={() => handleDeleteCategory(category)}
                    >
                      <FaTrash aria-hidden="true" />
                    </button>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </section>

      {modal?.type === 'category' && activeFamily && (
        <Modal title="Créer une catégorie" onClose={() => setModal(null)}>
          <CategoryForm
            isSaving={isSaving}
            onCancel={() => setModal(null)}
            onSubmit={handleCreateCategory}
          />
        </Modal>
      )}

      {modal?.type === 'edit-category' && (
        <Modal title="Modifier une catégorie" onClose={() => setModal(null)}>
          <CategoryForm
            initialValues={modal.category}
            isSaving={isSaving}
            onCancel={() => setModal(null)}
            onSubmit={handleUpdateCategory}
          />
        </Modal>
      )}
    </main>
  )
}

function CategoryForm({ initialValues, isSaving, onCancel, onSubmit }) {
  const [selectedIcon, setSelectedIcon] = useState(
    initialValues?.icon ?? fallbackIcon.key,
  )
  const [selectedColor, setSelectedColor] = useState(
    initialValues?.iconColor ?? colorOptions[0],
  )

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    onSubmit({
      id: initialValues?.id,
      name: formData.get('name'),
      icon: selectedIcon,
      iconColor: selectedColor,
    })
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="category-name">Nom</label>
        <input
          id="category-name"
          name="name"
          type="text"
          defaultValue={initialValues?.name}
          required
        />
      </div>
      <div className="form-field">
        <span className="field-label">Icône</span>
        <div className="icon-picker" role="listbox" aria-label="Icône">
          {iconOptions.map(({ Icon, key, label }) => (
            <button
              key={key}
              type="button"
              className="icon-choice"
              aria-selected={selectedIcon === key}
              onClick={() => setSelectedIcon(key)}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="category-icon-color">Couleur</label>
        <div className="color-picker" aria-label="Couleur de l’icône">
          {colorOptions.map((color) => (
            <button
              key={color}
              type="button"
              className="color-choice"
              aria-label={color}
              aria-pressed={selectedColor === color}
              style={{ '--color-choice': color }}
              onClick={() => setSelectedColor(color)}
            />
          ))}
          <input
            id="category-icon-color"
            name="iconColor"
            type="color"
            value={selectedColor}
            onChange={(event) => setSelectedColor(event.target.value)}
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
        <button className="form-button" type="submit" disabled={isSaving}>
          Enregistrer
        </button>
      </div>
    </form>
  )
}
