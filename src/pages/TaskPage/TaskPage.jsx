import { useEffect, useMemo, useState } from 'react'
import {
  FaCalendarDay,
  FaHouseChimney,
  FaListCheck,
  FaPen,
  FaPlus,
  FaRotate,
  FaTags,
  FaTrash,
  FaTrophy,
} from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { DashboardActions } from '../../components/DashboardActions/DashboardActions.jsx'
import { Logo } from '../../components/Logo/Logo.jsx'
import { Modal } from '../../components/Modal/Modal.jsx'
import {
  createFamilyTask,
  deleteTask,
  fetchFamilies,
  fetchFamilyCategories,
  fetchFamilyTasks,
  updateTask,
} from '../../services/api.js'
import '../../forms/form.css'
import './TaskPage.css'

const recurrenceOptions = [
  { value: 'daily', label: 'Quotidienne' },
  { value: 'weekly', label: 'Hebdomadaire' },
  { value: 'monthly', label: 'Mensuelle' },
  { value: 'yearly', label: 'Annuelle' },
]

function recurrenceLabel(value) {
  return recurrenceOptions.find((option) => option.value === value)?.label
}

function formatDate(date) {
  if (!date) {
    return 'Pas de limite'
  }

  const [year, month, day] = date.split('-')
  return `${day}.${month}.${year}`
}

export function TaskPage() {
  const [families, setFamilies] = useState([])
  const [activeFamilyId, setActiveFamilyId] = useState(null)
  const [categories, setCategories] = useState([])
  const [tasks, setTasks] = useState([])
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

    async function loadTaskData() {
      if (!activeFamilyId) {
        setCategories([])
        setTasks([])
        return
      }

      setIsLoading(true)
      setError('')

      try {
        const [nextCategories, nextTasks] = await Promise.all([
          fetchFamilyCategories(activeFamilyId),
          fetchFamilyTasks(activeFamilyId),
        ])
        if (!ignore) {
          setCategories(nextCategories)
          setTasks(nextTasks)
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

    loadTaskData()

    return () => {
      ignore = true
    }
  }, [activeFamilyId])

  async function handleCreateTask(task) {
    if (!activeFamily) {
      return
    }

    setIsSaving(true)
    setError('')
    try {
      const createdTask = await createFamilyTask(activeFamily.id, task)
      setTasks((currentTasks) => [...currentTasks, createdTask])
      setModal(null)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleUpdateTask(task) {
    setIsSaving(true)
    setError('')
    try {
      const updatedTask = await updateTask(task)
      setTasks((currentTasks) =>
        currentTasks.map((currentTask) =>
          currentTask.id === updatedTask.id ? updatedTask : currentTask,
        ),
      )
      setModal(null)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleDeleteTask(task) {
    const shouldDelete = window.confirm(`Supprimer la tâche "${task.name}" ?`)
    if (!shouldDelete) {
      return
    }

    setIsSaving(true)
    setError('')
    try {
      await deleteTask(task.id)
      setTasks((currentTasks) =>
        currentTasks.filter((currentTask) => currentTask.id !== task.id),
      )
    } catch (deleteError) {
      setError(deleteError.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="task-page">
      <header className="task-header">
        <Link className="brand-link" to="/dashboard" aria-label="Dashboard Domiz">
          <Logo />
        </Link>
        <div className="task-header-main">
          <div className="task-title">
            <p>
              <FaListCheck aria-hidden="true" />
              Tâches
            </p>
            <h1>Gestion des tâches</h1>
          </div>
          <DashboardActions />
        </div>
      </header>

      {error && <p className="task-alert">{error}</p>}
      {isLoading && <p className="task-alert">Chargement des tâches...</p>}

      <section className="task-panel" aria-labelledby="task-title">
        <div className="panel-heading-row">
          <div>
            <p>Famille active</p>
            <h2 id="task-title">{activeFamily?.name ?? 'Aucune famille'}</h2>
          </div>
          <button
            type="button"
            disabled={!activeFamily || isSaving}
            onClick={() => setModal({ type: 'task' })}
          >
            <FaPlus aria-hidden="true" />
            Créer une tâche
          </button>
        </div>

        <div className="task-switcher" aria-label="Choisir une famille">
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

        <div className="task-grid">
          {!activeFamily || tasks.length === 0 ? (
            <div className="empty-task">
              <FaListCheck aria-hidden="true" />
              <p>
                {activeFamily
                  ? 'Aucune tâche dans cette famille pour le moment.'
                  : 'Crée une famille avant de gérer les tâches.'}
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <article className="task-card" key={task.id}>
                <div className="task-card-main">
                  <h3>{task.name}</h3>
                  {task.description && <p>{task.description}</p>}
                </div>
                <div className="task-meta">
                  <span>
                    <FaTrophy aria-hidden="true" />
                    {task.points} pts
                  </span>
                  <span>
                    <FaCalendarDay aria-hidden="true" />
                    {formatDate(task.dueDate)}
                  </span>
                  {task.recurrenceType && (
                    <span>
                      <FaRotate aria-hidden="true" />
                      {recurrenceLabel(task.recurrenceType)}
                    </span>
                  )}
                </div>
                <div className="task-categories">
                  {task.categories.length === 0 ? (
                    <span>Aucune catégorie</span>
                  ) : (
                    task.categories.map((category) => (
                      <span key={category.id}>
                        <FaTags aria-hidden="true" />
                        {category.name}
                      </span>
                    ))
                  )}
                </div>
                <div className="task-card-actions">
                  <button
                    type="button"
                    disabled={isSaving}
                    aria-label={`Modifier ${task.name}`}
                    onClick={() => setModal({ type: 'edit-task', task })}
                  >
                    <FaPen aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    disabled={isSaving}
                    aria-label={`Supprimer ${task.name}`}
                    onClick={() => handleDeleteTask(task)}
                  >
                    <FaTrash aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {modal?.type === 'task' && activeFamily && (
        <Modal title="Créer une tâche" onClose={() => setModal(null)}>
          <TaskForm
            categories={categories}
            isSaving={isSaving}
            onCancel={() => setModal(null)}
            onSubmit={handleCreateTask}
          />
        </Modal>
      )}

      {modal?.type === 'edit-task' && (
        <Modal title="Modifier une tâche" onClose={() => setModal(null)}>
          <TaskForm
            categories={categories}
            initialValues={modal.task}
            isSaving={isSaving}
            onCancel={() => setModal(null)}
            onSubmit={handleUpdateTask}
          />
        </Modal>
      )}
    </main>
  )
}

function TaskForm({ categories, initialValues, isSaving, onCancel, onSubmit }) {
  const [isRecurring, setIsRecurring] = useState(Boolean(initialValues?.recurrenceType))

  function handleSubmit(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    onSubmit({
      id: initialValues?.id,
      name: formData.get('name'),
      description: formData.get('description'),
      dueDate: formData.get('dueDate'),
      points: formData.get('points'),
      recurrenceType: isRecurring ? formData.get('recurrenceType') : '',
      categoryIds: formData.getAll('categoryIds').map(Number),
      state: initialValues?.state ?? 'todo',
    })
  }

  const selectedCategoryIds = new Set(
    initialValues?.categories.map((category) => category.id) ?? [],
  )

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <label htmlFor="task-name">Nom</label>
          <input
            id="task-name"
            name="name"
            type="text"
            defaultValue={initialValues?.name}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="task-points">Points</label>
          <input
            id="task-points"
            name="points"
            type="number"
            min="0"
            step="1"
            defaultValue={initialValues?.points ?? 0}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="task-due-date">Date limite</label>
          <input
            id="task-due-date"
            name="dueDate"
            type="date"
            defaultValue={initialValues?.dueDate}
          />
        </div>
        <div className="form-field task-toggle-field">
          <label htmlFor="task-recurring">Récurrente</label>
          <input
            id="task-recurring"
            type="checkbox"
            checked={isRecurring}
            onChange={(event) => setIsRecurring(event.target.checked)}
          />
        </div>
        {isRecurring && (
          <div className="form-field">
            <label htmlFor="task-recurrence-type">Récurrence</label>
            <select
              id="task-recurrence-type"
              name="recurrenceType"
              defaultValue={initialValues?.recurrenceType || 'weekly'}
              required
            >
              {recurrenceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="form-field form-field-full">
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            name="description"
            defaultValue={initialValues?.description}
            rows="3"
          />
        </div>
      </div>

      <div className="form-field">
        <span className="field-label">Catégories</span>
        <div className="task-category-picker">
          {categories.length === 0 ? (
            <p>Aucune catégorie disponible pour cette famille.</p>
          ) : (
            categories.map((category) => (
              <label key={category.id}>
                <input
                  name="categoryIds"
                  type="checkbox"
                  value={category.id}
                  defaultChecked={selectedCategoryIds.has(category.id)}
                />
                <span>{category.name}</span>
              </label>
            ))
          )}
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
