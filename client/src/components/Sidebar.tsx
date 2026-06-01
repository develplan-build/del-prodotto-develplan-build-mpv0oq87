import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/app/dashboard', label: 'Dashboard analytics', icon: '◌' },
  { to: '/app/users', label: 'Utenti e ruoli', icon: '◎' },
  { to: '/app/clients', label: 'CRM clienti', icon: '◍' },
  { to: '/app/tasks', label: 'Kanban task', icon: '◈' },
  { to: '/app/billing', label: 'Fatturazione', icon: '◐' },
  { to: '/app/integrations', label: 'Integrazioni', icon: '◒' }
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">DB</div>
        <div>
          <h1>Develplan Build</h1>
          <p>Software factory AI</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-indicator" />
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer glass-card">
        <span className="eyebrow">Deploy pipeline</span>
        <strong>Publishing ready</strong>
        <p>Frontend, backend e dashboard pronti per il rilascio con URL pubblico.</p>
      </div>
    </aside>
  )
}
