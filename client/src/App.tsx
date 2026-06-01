import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { NavLink, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { API_URL } from './config'
import { createEmptyState } from './data'
import { AppState } from './types'
import { LandingPage } from './pages/LandingPage'
import { DashboardPage } from './pages/DashboardPage'
import { UsersPage } from './pages/UsersPage'
import { ClientsPage } from './pages/ClientsPage'
import { TasksPage } from './pages/TasksPage'
import { BillingPage } from './pages/BillingPage'
import { IntegrationsPage } from './pages/IntegrationsPage'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'

interface AppContextValue {
  state: AppState
  loading: boolean
  error: string
  demoMode: boolean
  notice: string
  setNotice: (value: string) => void
  loadDemoData: () => Promise<void>
  resetData: () => Promise<void>
  addUser: (payload: { name: string; email: string; role: 'Admin' | 'Builder' | 'Viewer' }) => void
  updateUserStatus: (id: string, status: 'Active' | 'Invited' | 'Suspended') => void
  addClient: (payload: { company: string; owner: string; email: string; status: 'Lead' | 'Qualified' | 'Customer' }) => void
  addTask: (payload: { title: string; priority: 'Low' | 'Medium' | 'High'; column: 'backlog' | 'progress' | 'review' | 'done' }) => void
  moveTask: (id: string, from: 'backlog' | 'progress' | 'review' | 'done', to: 'backlog' | 'progress' | 'review' | 'done') => void
  addInvoice: (payload: { customer: string; amount: number; status: 'Draft' | 'Paid' | 'Overdue'; plan: string }) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export const useAppState = () => {
  const context = useContext(AppContext)
  if (!context) throw new Error('useAppState must be used inside AppContext')
  return context
}

const AppShell = () => {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  if (isLanding) return <LandingPage />

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="app-main">
        <Header />
        <main className="page-content">
          <Routes>
            <Route path="/app/dashboard" element={<DashboardPage />} />
            <Route path="/app/users" element={<UsersPage />} />
            <Route path="/app/clients" element={<ClientsPage />} />
            <Route path="/app/tasks" element={<TasksPage />} />
            <Route path="/app/billing" element={<BillingPage />} />
            <Route path="/app/integrations" element={<IntegrationsPage />} />
            <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const [state, setState] = useState<AppState>(createEmptyState())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [demoMode, setDemoMode] = useState(false)
  const [notice, setNotice] = useState('')

  const fetchInitial = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${API_URL}/api/dashboard`)
      if (!response.ok) throw new Error('Impossibile caricare la dashboard')
      const data = await response.json()
      setState((current) => ({
        ...current,
        kpis: data.kpis,
        analytics: data.analytics,
        integrations: data.integrations
      }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore sconosciuto')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchInitial()
  }, [])

  const loadDemoData = async () => {
    setLoading(true)
    try {
      const [dashboard, users, clients, tasks, invoices] = await Promise.all([
        fetch(`${API_URL}/api/demo/dashboard`).then((res) => res.json()),
        fetch(`${API_URL}/api/demo/users`).then((res) => res.json()),
        fetch(`${API_URL}/api/demo/clients`).then((res) => res.json()),
        fetch(`${API_URL}/api/demo/tasks`).then((res) => res.json()),
        fetch(`${API_URL}/api/demo/invoices`).then((res) => res.json())
      ])
      setState((current) => ({
        ...current,
        kpis: dashboard.kpis,
        analytics: dashboard.analytics,
        users: users.items,
        clients: clients.items,
        tasks: tasks.columns,
        invoices: invoices.items,
        invoiceSummary: invoices.summary
      }))
      setDemoMode(true)
      setNotice('Dati demo caricati con successo.')
    } catch {
      setNotice('Impossibile caricare i dati demo.')
    } finally {
      setLoading(false)
    }
  }

  const resetData = async () => {
    setState((current) => ({ ...createEmptyState(), integrations: current.integrations }))
    setDemoMode(false)
    setNotice('Workspace azzerato. Ora la SaaS è di nuovo pulita.')
  }

  const addUser: AppContextValue['addUser'] = (payload) => {
    const item = { id: crypto.randomUUID(), ...payload, status: 'Invited' as const }
    setState((current) => ({ ...current, users: [item, ...current.users] }))
    setNotice('Utente aggiunto correttamente.')
  }

  const updateUserStatus: AppContextValue['updateUserStatus'] = (id, status) => {
    setState((current) => ({
      ...current,
      users: current.users.map((user) => (user.id === id ? { ...user, status } : user))
    }))
    setNotice(`Stato utente aggiornato a ${status}.`)
  }

  const addClient: AppContextValue['addClient'] = (payload) => {
    const item = { id: crypto.randomUUID(), ...payload }
    setState((current) => ({ ...current, clients: [item, ...current.clients] }))
    setNotice('Cliente creato correttamente.')
  }

  const addTask: AppContextValue['addTask'] = (payload) => {
    const task = { id: crypto.randomUUID(), title: payload.title, priority: payload.priority }
    setState((current) => ({
      ...current,
      tasks: { ...current.tasks, [payload.column]: [task, ...current.tasks[payload.column]] }
    }))
    setNotice('Task aggiunto alla board.')
  }

  const moveTask: AppContextValue['moveTask'] = (id, from, to) => {
    setState((current) => {
      const task = current.tasks[from].find((item) => item.id === id)
      if (!task) return current
      return {
        ...current,
        tasks: {
          ...current.tasks,
          [from]: current.tasks[from].filter((item) => item.id !== id),
          [to]: [task, ...current.tasks[to]]
        }
      }
    })
    setNotice('Task spostato con successo.')
  }

  const addInvoice: AppContextValue['addInvoice'] = (payload) => {
    const invoice = { id: crypto.randomUUID(), ...payload }
    setState((current) => ({
      ...current,
      invoices: [invoice, ...current.invoices],
      invoiceSummary: {
        ...current.invoiceSummary,
        draft: current.invoiceSummary.draft + (payload.status === 'Draft' ? 1 : 0),
        paid: current.invoiceSummary.paid + (payload.status === 'Paid' ? 1 : 0),
        overdue: current.invoiceSummary.overdue + (payload.status === 'Overdue' ? 1 : 0),
        recurring: current.invoiceSummary.recurring + 1
      }
    }))
    setNotice('Fattura creata correttamente.')
  }

  const value = useMemo(
    () => ({ state, loading, error, demoMode, notice, setNotice, loadDemoData, resetData, addUser, updateUserStatus, addClient, addTask, moveTask, addInvoice }),
    [state, loading, error, demoMode, notice]
  )

  return (
    <AppContext.Provider value={value}>
      <Routes>
        <Route path="/*" element={<AppShell />} />
      </Routes>
    </AppContext.Provider>
  )
}
