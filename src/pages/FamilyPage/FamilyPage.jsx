import { useMemo, useState } from 'react'
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
import './FamilyPage.css'

const initialProfile = {
  firstName: 'Guilhem',
  lastName: 'Vibe',
  email: 'guilhem@domiz.local',
  birthDate: '1990-05-14',
  passwordStatus: 'Défini',
}

const initialFamilies = [
  {
    id: 'family-home',
    name: 'Maison principale',
    members: [
      {
        id: 'member-lina',
        firstName: 'Lina',
        lastName: 'Vibe',
        email: 'lina@domiz.local',
        birthDate: '1992-09-18',
        role: 'Parent',
        status: 'Compte lié',
      },
      {
        id: 'member-noah',
        firstName: 'Noah',
        lastName: 'Vibe',
        email: '',
        birthDate: '2014-03-08',
        role: 'Enfant',
        status: 'Membre local',
      },
    ],
  },
  {
    id: 'family-weekend',
    name: 'Maison du week-end',
    members: [
      {
        id: 'member-maya',
        firstName: 'Maya',
        lastName: 'Vibe',
        email: 'maya@domiz.local',
        birthDate: '2016-11-22',
        role: 'Enfant',
        status: 'Invitation envoyée',
      },
    ],
  },
]

function formatBirthDate(date) {
  if (!date) {
    return 'Non renseignée'
  }

  const [year, month, day] = date.split('-')

  return `${day}.${month}.${year}`
}

export function FamilyPage() {
  const [profile, setProfile] = useState(initialProfile)
  const [families, setFamilies] = useState(initialFamilies)
  const [activeFamilyId, setActiveFamilyId] = useState(initialFamilies[0].id)
  const [modal, setModal] = useState(null)

  const activeFamily = useMemo(
    () => families.find((family) => family.id === activeFamilyId) ?? families[0],
    [activeFamilyId, families],
  )

  function updateActiveFamilyMembers(updater) {
    setFamilies((currentFamilies) =>
      currentFamilies.map((family) =>
        family.id === activeFamily.id
          ? { ...family, members: updater(family.members) }
          : family,
      ),
    )
  }

  function handleAddMember(member) {
    updateActiveFamilyMembers((members) => [
      ...members,
      { ...member, id: `member-${Date.now()}` },
    ])
    setModal(null)
  }

  function handleEditMember(member) {
    updateActiveFamilyMembers((members) =>
      members.map((currentMember) =>
        currentMember.id === member.id
          ? { ...currentMember, ...member }
          : currentMember,
      ),
    )
    setModal(null)
  }

  function handleAddFamily(family) {
    setFamilies((currentFamilies) => [...currentFamilies, family])
    setActiveFamilyId(family.id)
    setModal(null)
  }

  function handleInvite(invitation) {
    updateActiveFamilyMembers((members) => [...members, invitation])
    setModal(null)
  }

  function handleProfileSubmit(nextProfile) {
    const { password, ...profileFields } = nextProfile

    setProfile((currentProfile) => ({
      ...currentProfile,
      ...profileFields,
      passwordStatus: password ? 'Mis à jour' : currentProfile.passwordStatus,
    }))
    setModal(null)
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

      <section className="family-layout">
        <article className="profile-panel">
          <div className="panel-heading-row">
            <div>
              <p>Mon profil</p>
              <h2>
                {profile.firstName} {profile.lastName}
              </h2>
            </div>
            <button type="button" onClick={() => setModal({ type: 'profile' })}>
              <FaPen aria-hidden="true" />
              Modifier
            </button>
          </div>

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
        </article>

        <section className="families-panel" aria-labelledby="families-title">
          <div className="panel-heading-row">
            <div>
              <p>Mes familles</p>
              <h2 id="families-title">{activeFamily.name}</h2>
            </div>
            <div className="family-actions">
              <button type="button" onClick={() => setModal({ type: 'family' })}>
                <FaPlus aria-hidden="true" />
                Créer une famille
              </button>
              <button type="button" onClick={() => setModal({ type: 'member' })}>
                <FaPlus aria-hidden="true" />
                Créer un membre
              </button>
              <button type="button" onClick={() => setModal({ type: 'invite' })}>
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
                aria-current={family.id === activeFamily.id ? 'true' : undefined}
                onClick={() => setActiveFamilyId(family.id)}
              >
                <FaUserGroup aria-hidden="true" />
                {family.name}
              </button>
            ))}
          </div>

          <div className="family-members">
            {activeFamily.members.length === 0 ? (
              <div className="empty-family">
                <FaUserGroup aria-hidden="true" />
                <p>Aucun membre dans cette famille pour le moment.</p>
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

      {modal?.type === 'profile' && (
        <Modal title="Modifier mon profil" onClose={() => setModal(null)}>
          <ProfileForm
            initialValues={profile}
            onCancel={() => setModal(null)}
            onSubmit={handleProfileSubmit}
          />
        </Modal>
      )}

      {modal?.type === 'member' && (
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

      {modal?.type === 'invite' && (
        <Modal title="Inviter un utilisateur" onClose={() => setModal(null)}>
          <InviteMemberForm
            familyName={activeFamily.name}
            onCancel={() => setModal(null)}
            onSubmit={handleInvite}
          />
        </Modal>
      )}

      {modal?.type === 'edit-member' && (
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
