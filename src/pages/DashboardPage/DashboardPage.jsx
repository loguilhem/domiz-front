import {
  FaBolt,
  FaCalendarCheck,
  FaCircleExclamation,
  FaCrown,
  FaFire,
  FaHouseChimney,
  FaStar,
  FaTrophy,
  FaUser,
  FaUsers,
} from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { DashboardActions } from '../../components/DashboardActions/DashboardActions.jsx'
import { Logo } from '../../components/Logo/Logo.jsx'
import { useAppPreferences } from '../../providers/AppPreferences.jsx'
import './DashboardPage.css'

const me = {
  firstName: 'Guilhem',
  lastName: 'Vibe',
  age: 34,
  monthScore: 1240,
  totalScore: 18450,
  level: 'Niveau 12',
  title: 'Captain Home',
}

const familyMembers = [
  { firstName: 'Lina', score: 980, level: 'Niveau 9', color: '#ff5b9a' },
  { firstName: 'Noah', score: 760, level: 'Niveau 7', color: '#2ad7ff' },
  { firstName: 'Maya', score: 640, level: 'Niveau 6', color: '#ffef5a' },
  { firstName: 'Alex', score: 420, level: 'Niveau 4', color: '#7cff7a' },
]

const monthlyTasks = [
  {
    title: 'Ranger cuisine',
    owner: 'Guilhem',
    status: 'done',
    progress: 100,
    day: '03',
  },
  {
    title: 'Courses semaine',
    owner: 'Lina',
    status: 'done',
    progress: 100,
    day: '07',
  },
  {
    title: 'Tri recyclage',
    owner: 'Noah',
    status: 'late',
    progress: 35,
    day: '11',
  },
  {
    title: 'Salle de bain',
    owner: 'Maya',
    status: 'current',
    progress: 68,
    day: '16',
  },
  {
    title: 'Arroser plantes',
    owner: 'Alex',
    status: 'todo',
    progress: 10,
    day: '20',
  },
  {
    title: 'Grand reset',
    owner: 'Famille',
    status: 'todo',
    progress: 0,
    day: '27',
  },
]

function statusLabel(status) {
  const labels = {
    current: 'En cours',
    done: 'Validée',
    late: 'En retard',
    todo: 'À venir',
  }

  return labels[status]
}

function StatPill({ icon, label, value }) {
  return (
    <div className="stat-pill">
      <span className="stat-icon" aria-hidden="true">
        {icon}
      </span>
      <span>
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
    </div>
  )
}

function FamilyCard({ member }) {
  return (
    <article className="family-card" style={{ '--card-accent': member.color }}>
      <div className="family-avatar" aria-hidden="true">
        {member.firstName.charAt(0)}
      </div>
      <div>
        <h3>{member.firstName}</h3>
        <p>{member.level}</p>
      </div>
      <strong>{member.score} pts</strong>
    </article>
  )
}

function TimelineItem({ task }) {
  return (
    <article className={`timeline-item timeline-item-${task.status}`}>
      <div className="timeline-date">{task.day}</div>
      <div className="timeline-content">
        <div className="timeline-heading">
          <h3>{task.title}</h3>
          <span>{statusLabel(task.status)}</span>
        </div>
        <p>{task.owner}</p>
        <div className="task-progress" aria-label={`${task.progress}% terminé`}>
          <span style={{ width: `${task.progress}%` }}></span>
        </div>
      </div>
    </article>
  )
}

export function DashboardPage() {
  const { t } = useAppPreferences()

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <Link className="brand-link" to="/" aria-label="Accueil Domiz">
          <Logo />
        </Link>
        <div className="dashboard-header-main">
          <div className="dashboard-title">
            <p>
              <FaHouseChimney aria-hidden="true" />
              {t.dashboard}
            </p>
            <h1>{t.dashboardTitle}</h1>
          </div>
          <DashboardActions />
        </div>
      </header>

      <section className="dashboard-grid" aria-label="Scores de la famille">
        <article className="me-panel">
          <div className="panel-heading">
            <span className="panel-icon" aria-hidden="true">
              <FaUser />
            </span>
            <div>
              <p>{t.me}</p>
              <h2>
                {me.firstName} {me.lastName}
              </h2>
            </div>
          </div>

          <div className="level-badge">
            <FaCrown aria-hidden="true" />
            <span>{me.level}</span>
            <strong>{me.title}</strong>
          </div>

          <div className="stats-grid">
            <StatPill icon={<FaStar />} label="Âge" value={`${me.age} ans`} />
            <StatPill
              icon={<FaBolt />}
              label="Score du mois"
              value={`${me.monthScore} pts`}
            />
            <StatPill
              icon={<FaTrophy />}
              label="Score total"
              value={`${me.totalScore} pts`}
            />
            <StatPill icon={<FaFire />} label="Niveau actuel" value={me.level} />
          </div>
        </article>

        <section className="family-panel" aria-labelledby="family-title">
          <div className="panel-heading">
            <span className="panel-icon" aria-hidden="true">
              <FaUsers />
            </span>
            <div>
              <p>{t.myFamily}</p>
              <h2 id="family-title">{t.monthTeam}</h2>
            </div>
          </div>
          <div className="family-list">
            {familyMembers.map((member) => (
              <FamilyCard key={member.firstName} member={member} />
            ))}
          </div>
        </section>
      </section>

      <section className="tasks-panel" aria-labelledby="tasks-title">
        <div className="tasks-heading">
          <div>
            <p>
              <FaCalendarCheck aria-hidden="true" />
              {t.currentMonth}
            </p>
            <h2 id="tasks-title">{t.taskTimeline}</h2>
          </div>
          <div className="late-legend">
            <FaCircleExclamation aria-hidden="true" />
            {t.lateTasks}
          </div>
        </div>

        <div className="timeline">
          {monthlyTasks.map((task) => (
            <TimelineItem key={`${task.day}-${task.title}`} task={task} />
          ))}
        </div>
      </section>
    </main>
  )
}
