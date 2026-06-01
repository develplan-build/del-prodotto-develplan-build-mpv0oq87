import { FormEvent, useMemo, useState } from 'react'
import { useAppState } from '../App'

export function ClientsPage() {
  const { state, addClient } = useAppState()
  const [query, setQuery] = useState('')
  const [form, setForm] = useState({ company: '', owner: '', email: '', status: 'Lead' as 'Lead' | 'Qualified' | 'Customer' })

  const filtered = useMemo(
    () => state.clients.filter((client) => [client.company, client.owner, client.email, client.status].join(' ').toLowerCase().includes(query.toLowerCase())),
    [state.clients, query]
  )

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.company || !form.owner || !form.email) return
    addClient(form)
    setForm({ company: '', owner: '', email: '', status: 'Lead' })
  }

  return (
    <div className="page-grid">
      <section className="two-column-layout">
        <article className="glass-card data-card">
          <div className="card-head">
            <h3>Client pipeline</h3>
            <div className="inline-actions">
              <input className="inline-input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filtra clienti" />
              <button className="secondary-button" onClick={() => setQuery('')}>Reset filtro</button>
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="empty-state">Nessun cliente ancora — aggiungi il primo contatto commerciale.</div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Azienda</th><th>Referente</th><th>Email</th><th>Status</th></tr></thead>
              <tbody>
                {filtered.map((client) => (
                  <tr key={client.id}>
                    <td>{client.company}</td>
                    <td>{client.owner}</td>
                    <td>{client.email}</td>
                    <td><span className={`badge ${client.status === 'Customer' ? 'success' : client.status === 'Qualified' ? 'warning' : 'muted'}`}>{client.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>

        <article className="glass-card form-card">
          <div className="card-head"><h3>Nuovo cliente</h3><span className="status-chip">CRM</span></div>
          <form className="stack-form" onSubmit={onSubmit}>
            <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Azienda" />
            <input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} placeholder="Referente" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'Lead' | 'Qualified' | 'Customer' })}>
              <option value="Lead">Lead</option>
              <option value="Qualified">Qualified</option>
              <option value="Customer">Customer</option>
            </select>
            <div className="form-actions">
              <button className="primary-button" type="submit">Crea cliente</button>
              <button className="secondary-button" type="button" onClick={() => setForm({ company: '', owner: '', email: '', status: 'Lead' })}>Pulisci</button>
            </div>
          </form>
        </article>
      </section>
    </div>
  )
}
