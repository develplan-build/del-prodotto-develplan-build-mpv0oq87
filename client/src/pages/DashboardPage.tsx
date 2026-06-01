import { FormEvent, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { API_URL } from '../config'
import { useAppState } from '../App'

export function DashboardPage() {
  const { state, loading, error } = useAppState()
  const [wizard, setWizard] = useState({ idea: '', audience: '', stackPreference: '', monetization: '' })
  const [result, setResult] = useState('')
  const [building, setBuilding] = useState(false)

  const cards = useMemo(
    () => [
      { label: 'App generate', value: state.kpis.generatedApps, trend: '+0%' },
      { label: 'Build attive', value: state.kpis.activeBuilds, trend: '+0%' },
      { label: 'Progetti pubblicati', value: state.kpis.publishedProjects, trend: '+0%' },
      { label: 'MRR', value: `€${state.kpis.monthlyRevenue}`, trend: '+0%' }
    ],
    [state.kpis]
  )

  const submitWizard = async (event: FormEvent) => {
    event.preventDefault()
    setBuilding(true)
    setResult('')
    try {
      const response = await fetch(`${API_URL}/api/ai/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wizard)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Errore build')
      setResult(`${data.blueprint.productSummary} · ${data.blueprint.nextStep}`)
    } catch (err) {
      setResult(err instanceof Error ? err.message : 'Errore inatteso')
    } finally {
      setBuilding(false)
    }
  }

  return (
    <div className="page-grid">
      <section className="kpi-grid">
        {cards.map((card) => (
          <article key={card.label} className="glass-card kpi-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
            <em>{card.trend}</em>
          </article>
        ))}
      </section>

      <section className="two-column-layout">
        <article className="glass-card chart-card">
          <div className="card-head"><h3>Build & deploy trend</h3><span className="status-chip">Realtime</span></div>
          {loading ? <div className="empty-state compact">Caricamento analytics...</div> : error ? <div className="empty-state compact">{error}</div> : state.analytics.length === 0 ? <div className="empty-state compact">Nessun dato analytics ancora — carica demo o pubblica il primo progetto.</div> : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={state.analytics}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip contentStyle={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16 }} />
                  <Bar dataKey="builds" fill="#a3e635" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="deploys" fill="#bef264" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </article>

        <article className="glass-card wizard-card">
          <div className="card-head"><h3>AI app generator</h3><span className="status-chip">Wizard</span></div>
          <form className="stack-form" onSubmit={submitWizard}>
            <textarea placeholder="Descrivi l'idea del prodotto" value={wizard.idea} onChange={(e) => setWizard({ ...wizard, idea: e.target.value })} rows={4} />
            <input placeholder="Target utenti" value={wizard.audience} onChange={(e) => setWizard({ ...wizard, audience: e.target.value })} />
            <input placeholder="Stack preferito" value={wizard.stackPreference} onChange={(e) => setWizard({ ...wizard, stackPreference: e.target.value })} />
            <input placeholder="Monetizzazione" value={wizard.monetization} onChange={(e) => setWizard({ ...wizard, monetization: e.target.value })} />
            <div className="form-actions">
              <button className="primary-button" type="submit" disabled={building}>{building ? 'Costruzione...' : 'Genera blueprint'}</button>
              <button className="secondary-button" type="button" onClick={() => setWizard({ idea: '', audience: '', stackPreference: '', monetization: '' })}>Reset wizard</button>
            </div>
            {result ? <p className="form-feedback">{result}</p> : null}
          </form>
        </article>
      </section>

      <section className="glass-card integrations-snapshot">
        <div className="card-head"><h3>Servizi predisposti</h3><span className="status-chip">Env-based</span></div>
        <div className="integration-grid compact-grid">
          {state.integrations.map((service) => (
            <div key={service.key} className="integration-item">
              <strong>{service.key}</strong>
              <span className={service.configured ? 'badge success' : 'badge muted'}>{service.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
