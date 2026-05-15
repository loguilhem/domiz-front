import { useEffect, useMemo, useState } from 'react'
import {
  FaEnvelope,
  FaHouseChimney,
  FaPen,
  FaPlus,
  FaUserGroup,
} from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { DashboardActions } from '../../components/DashboardActions/DashboardActions.jsx'
import { Logo } from '../../components/Logo/Logo.jsx'
import { Modal } from '../../components/Modal/Modal.jsx'
import { FamilyForm } from '../../forms/FamilyForm/FamilyForm.jsx'
import { FamilyMemberForm } from '../../forms/FamilyMemberForm/FamilyMemberForm.jsx'
import { InviteMemberForm } from '../../forms/InviteMemberForm/InviteMemberForm.jsx'
import { ProfileForm } from '../../forms/ProfileForm/ProfileForm.jsx'
import { useAuth } from '../../providers/AuthProvider.jsx'
import {
  createFamily,
  createFamilyMember,
  fetchFamilies,
  fetchProfile,
  inviteFamilyMember,
  updateFamilyMember,
  updateProfile,
} from '../../services/api.js'
import './FamilyPage.css'

function formatBirthDate(date) {
  if (!date) {
    return 'Non renseignée'
  }

  const [year, month, day] = date.split('-')

  return `${day}.${month}.${year}`
}

export function FamilyPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [families, setFamilies] = useState([])
  const [activeFamilyId, setActiveFamilyId] = useState(null)
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

    async function loadFamilyData() {
      setIsLoading(true)
      setError('')

      try {
        const [nextFamilies, nextProfile] = await Promise.all([
          fetchFamilies(),
          fetchProfile(user?.id),
        ])

        if (ignore) {
          return
        }

        setFamilies(nextFamilies)
        setProfile(nextProfile)
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

    loadFamilyData()

    return () => {
      ignore = true
    }
  }, [user?.id])

  function replaceFamilyMember(familyId, member) {
    setFamilies((currentFamilies) =>
      currentFamilies.map((family) => {
        if (family.id !== familyId) {
          return family
        }

        const hasMember = family.members.some(
          (currentMember) => currentMember.id === member.id,
        )
        return {
          ...family,
          members: hasMember
            ? family.members.map((currentMember) =>
                currentMember.id === member.id ? member : currentMember,
              )
            : [...family.members, member],
        }
      }),
    )
  }

  async function handleAddMember(member) {
    if (!activeFamily) {
      return
    }

    setIsSaving(true)
    setError('')
    try {
      const createdMember = await createFamilyMember(activeFamily.id, member)
      replaceFamilyMember(activeFamily.id, createdMember)
      setModal(null)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleEditMember(member) {
    if (!activeFamily) {
      return
    }

    setIsSaving(true)
    setError('')
    try {
      const updatedMember = await updateFamilyMember(activeFamily.id, member)
      replaceFamilyMember(activeFamily.id, updatedMember)
      setModal(null)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleAddFamily(family) {
    setIsSaving(true)
    setError('')
    try {
      const createdFamily = await createFamily(family)
      setFamilies((currentFamilies) => [...currentFamilies, createdFamily])
      setActiveFamilyId(createdFamily.id)
      setModal(null)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleInvite(invitation) {
    if (!activeFamily) {
      return
    }

    setIsSaving(true)
    setError('')
    try {
      const createdInvitation = await inviteFamilyMember(activeFamily.id, invitation)
      replaceFamilyMember(activeFamily.id, createdInvitation)
      setModal(null)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleProfileSubmit(nextProfile) {
    if (!profile) {
      return
    }

    setIsSaving(true)
    setError('')
    try {
      const updatedProfile = await updateProfile({ ...profile, ...nextProfile })
      setProfile(updatedProfile)
      setModal(null)
    } catch (saveError) {
      setError(saveError.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="family-page">
      <header className="family-header">
        <Link className="brand-link" to="/dashboard" aria-label="Dashboard Domiz">
          <Logo />
        </Link>
        <div className="family-header-main">
          <div className="family-title">
            <p>
              <FaHouseChimney aria-hidden="true" />
              Famille
            </p>
            <h1>Gestion familiale</h1>
          </div>
          <DashboardActions />
        </div>
      </header>

      {error && <p className="family-alert">{error}</p>}
      {isLoading && <p className="family-alert">Chargement des données...</p>}

      <section className="family-layout">
        <article className="profile-panel">
          <div className="panel-heading-row">
            <div>
              <p>Mon profil</p>
              <h2>
                {profile ? `${profile.firstName} ${profile.lastName}` : 'Aucun profil'}
              </h2>
            </div>
            <button
              type="button"
              disabled={!profile || isSaving}
              onClick={() => setModal({ type: 'profile' })}
            >
              <FaPen aria-hidden="true" />
              Modifier
            </button>
          </div>

          {profile ? (
            <dl className="profile-details">
              <div>
                <dt>Email</dt>
                <dd>{profile.email}</dd>
              </div>
              <div>
                <dt>Date de naissance</dt>
                <dd>{formatBirthDate(profile.birthDate)}</dd>
              </div>
              <div>
                <dt>Mot de passe</dt>
                <dd>{profile.passwordStatus}</dd>
              </div>
            </dl>
          ) : (
            <div className="empty-family">
              <FaUserGroup aria-hidden="true" />
              <p>Aucun utilisateur trouvé dans l’API.</p>
            </div>
          )}
        </article>

        <section className="families-panel" aria-labelledby="families-title">
          <div className="panel-heading-row">
            <div>
              <p>Mes familles</p>
              <h2 id="families-title">{activeFamily?.name ?? 'Aucune famille'}</h2>
            </div>
            <div className="family-actions">
              <button
                type="button"
                disabled={isSaving}
                onClick={() => setModal({ type: 'family' })}
              >
                <FaPlus aria-hidden="true" />
                Créer une famille
              </button>
              <button
                type="button"
                disabled={!activeFamily || isSaving}
                onClick={() => setModal({ type: 'member' })}
              >
                <FaPlus aria-hidden="true" />
                Créer un membre
              </button>
              <button
                type="button"
                disabled={!activeFamily || isSaving}
                onClick={() => setModal({ type: 'invite' })}
              >
                <FaEnvelope aria-hidden="true" />
                Inviter
              </button>
            </div>
          </div>

          <div className="family-switcher" aria-label="Choisir une famille">
            {families.map((family) => (
              <button
                key={family.id}
                type="button"
                aria-current={family.id === activeFamily?.id ? 'true' : undefined}
                onClick={() => setActiveFamilyId(family.id)}
              >
                <FaUserGroup aria-hidden="true" />
                {family.name}
              </button>
            ))}
          </div>

          <div className="family-members">
            {!activeFamily || activeFamily.members.length === 0 ? (
              <div className="empty-family">
                <FaUserGroup aria-hidden="true" />
                <p>
                  {activeFamily
                    ? 'Aucun membre dans cette famille pour le moment.'
                    : 'Crée une famille pour commencer.'}
                </p>
              </div>
            ) : (
              activeFamily.members.map((member) => (
                <article className="member-card" key={member.id}>
                  <div className="member-avatar" aria-hidden="true">
                    {member.firstName.charAt(0)}
                  </div>
                  <div className="member-info">
                    <h3>
                      {member.firstName} {member.lastName}
                    </h3>
                    <p>{member.role}</p>
                    <span>{member.status}</span>
                  </div>
                  <dl>
                    <div>
                      <dt>Email</dt>
                      <dd>{member.email || 'Aucun email'}</dd>
                    </div>
                    <div>
                      <dt>Naissance</dt>
                      <dd>{formatBirthDate(member.birthDate)}</dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    onClick={() => setModal({ type: 'edit-member', member })}
                  >
                    <FaPen aria-hidden="true" />
                    Éditer
                  </button>
                </article>
              ))
            )}
          </div>
        </section>
      </section>

      {modal?.type === 'profile' && profile && (
        <Modal title="Modifier mon profil" onClose={() => setModal(null)}>
          <ProfileForm
            initialValues={profile}
            onCancel={() => setModal(null)}
            onSubmit={handleProfileSubmit}
          />
        </Modal>
      )}

      {modal?.type === 'member' && activeFamily && (
        <Modal title="Créer un membre" onClose={() => setModal(null)}>
          <FamilyMemberForm
            familyName={activeFamily.name}
            onCancel={() => setModal(null)}
            onSubmit={handleAddMember}
          />
        </Modal>
      )}

      {modal?.type === 'family' && (
        <Modal title="Créer une famille" onClose={() => setModal(null)}>
          <FamilyForm
            onCancel={() => setModal(null)}
            onSubmit={handleAddFamily}
          />
        </Modal>
      )}

      {modal?.type === 'invite' && activeFamily && (
        <Modal title="Inviter un utilisateur" onClose={() => setModal(null)}>
          <InviteMemberForm
            familyName={activeFamily.name}
            onCancel={() => setModal(null)}
            onSubmit={handleInvite}
          />
        </Modal>
      )}

      {modal?.type === 'edit-member' && activeFamily && (
        <Modal title="Éditer un membre" onClose={() => setModal(null)}>
          <FamilyMemberForm
            familyName={activeFamily.name}
            initialValues={modal.member}
            onCancel={() => setModal(null)}
            onSubmit={handleEditMember}
          />
        </Modal>
      )}
    </main>
  )
}
