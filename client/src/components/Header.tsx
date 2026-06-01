import { useLocation, useNavigate } from 'react-router-dom'
import { useAppState } from '../App'

const titles: Record<string, { title: string; crumb: string }> = {
  '/app/dashboard': { title: 'Dashboard analytics', crumb: 'Overview' },
  '/app/users': { title: 'Gestione utenti e ruoli', crumb: 'Access control' },
  '/app/clients': { title: 'CRM / Gestione clienti', crumb: 'Pipeline' },
  '/app/tasks': { title: 'Kanban / Task management', crumb: 'Operations' },
  '/app/billing': { title: 'Fatturazione automatica', crumb: 'Revenue ops' },
  '/app/integrations': { title: 'Integrazioni e servizi', crumb: 'Connections' }
}

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { demoMode, loadDemoData, resetData, notice } = useAppState()
  const meta = titles[location.pathname] || titles['/app/dashboard']

  return (
    <header className="page-header">
      <div>
        <div className="breadcrumb">App / {meta.crumb}</div>
        <h2>{meta.title}</h2>
      </div>

      <div className="header-actions">
        <button className="secondary-button" onClick={() => navigate('/')}>Torna alla landing</button>
        {!demoMode ? (
          <button className="primary-button" onClick={() => void loadDemoData()}>Carica dati demo</button>
        ) : (
          <button className="danger-button" onClick={() => void resetData()}>Azzera dati</button>
        )}
      </div>

      {notice ? <div className="toast-notice">{notice}</div> : null}
    </header>
  )
}
