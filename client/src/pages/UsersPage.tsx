import { FormEvent, useMemo, useState } from 'react'
import { useAppState } from '../App'

export function UsersPage() {
  const { state, addUser, updateUserStatus } = useAppState()
  const [filter, setFilter] = useState<'All' | 'Active' | 'Invited' | 'Suspended'>('All')
  const [form, setForm] = useState({ name: '', email: '', role: 'Viewer' as 'Admin' | 'Builder' | 'Viewer' })

  const visibleUsers = useMemo(
    () => state.users.filter((user) => (filter === 'All' ? true : user.status === filter)),
    [state.users, filter]
  )

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.name || !form.email) return
    addUser(form)
    setForm({ name: '', email: '', role: 'Viewer' })
  }

  return (
    <div className="page-grid">
      <section className="two-column-layout">
        <article className="glass-card data-card">
          <div className="card-head">
            <h3>Team access</h3>
            <div className="inline-actions">
              <button className={filter === 'All' ? 'filter-chip active' : 'filter-chip'} onClick={() => setFilter('All')}>Tutti</button>
              <button className={filter === 'Active' ? 'filter-chip active' : 'filter-chip'} onClick={() => setFilter('Active')}>Active</button>
              <button className={filter === 'Invited' ? 'filter-chip active' : 'filter-chip'} onClick={() => setFilter('Invited')}>Invited</button>
              <button className={filter === 'Suspended' ? 'filter-chip active' : 'filter-chip'} onClick={() => setFilter('Suspended')}>Suspended</button>
            </div>
          </div>

          {visibleUsers.length === 0 ? (
            <div className="empty-state">Nessun utente ancora — aggiungi il primo membro del team.</div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Nome</th><th>Email</th><th>Ruolo</th><th>Stato</th><th>Azione</th></tr></thead>
              <tbody>
                {visibleUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td><span className={`badge ${user.status === 'Active' ? 'success' : user.status === 'Suspended' ? 'danger' : 'warning'}`}>{user.status}</span></td>
                    <td>
                      <div className="inline-actions">
                        <button className="table-action" onClick={() => updateUserStatus(user.id, 'Active')}>Attiva</button>
                        <button className="table-action" onClick={() => updateUserStatus(user.id, 'Suspended')}>Sospendi</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>

        <article className="glass-card form-card">
          <div className="card-head"><h3>Invita nuovo utente</h3><span className="status-chip">Role-based</span></div>
          <form className="stack-form" onSubmit={onSubmit}>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome e cognome" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email professionale" type="email" />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as 'Admin' | 'Builder' | 'Viewer' })}>
              <option value="Viewer">Viewer</option>
              <option value="Builder">Builder</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="form-actions">
              <button className="primary-button" type="submit">Invita utente</button>
              <button className="secondary-button" type="button" onClick={() => setForm({ name: '', email: '', role: 'Viewer' })}>Pulisci</button>
            </div>
          </form>
        </article>
      </section>
    </div>
  )
}
