import { FormEvent, useMemo, useState } from 'react'
import { useAppState } from '../App'

export function BillingPage() {
  const { state, addInvoice } = useAppState()
  const [form, setForm] = useState({ customer: '', amount: '', status: 'Draft' as 'Draft' | 'Paid' | 'Overdue', plan: 'Starter' })
  const total = useMemo(() => state.invoices.reduce((sum, invoice) => sum + invoice.amount, 0), [state.invoices])

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.customer || !form.amount) return
    addInvoice({ customer: form.customer, amount: Number(form.amount), status: form.status, plan: form.plan })
    setForm({ customer: '', amount: '', status: 'Draft', plan: 'Starter' })
  }

  return (
    <div className="page-grid">
      <section className="kpi-grid">
        <article className="glass-card kpi-card"><span>Bozze</span><strong>{state.invoiceSummary.draft}</strong><em>Automatic</em></article>
        <article className="glass-card kpi-card"><span>Pagate</span><strong>{state.invoiceSummary.paid}</strong><em>PayPal ready</em></article>
        <article className="glass-card kpi-card"><span>Scadute</span><strong>{state.invoiceSummary.overdue}</strong><em>Recovery</em></article>
        <article className="glass-card kpi-card"><span>Totale</span><strong>€{total}</strong><em>Locale</em></article>
      </section>

      <section className="two-column-layout">
        <article className="glass-card data-card">
          <div className="card-head"><h3>Fatture</h3><span className="status-chip">Recurring</span></div>
          {state.invoices.length === 0 ? (
            <div className="empty-state">Nessuna fattura ancora — crea il primo addebito automatico.</div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Cliente</th><th>Piano</th><th>Importo</th><th>Status</th></tr></thead>
              <tbody>
                {state.invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>{invoice.customer}</td>
                    <td>{invoice.plan}</td>
                    <td>€{invoice.amount}</td>
                    <td><span className={`badge ${invoice.status === 'Paid' ? 'success' : invoice.status === 'Overdue' ? 'danger' : 'warning'}`}>{invoice.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </article>

        <article className="glass-card form-card">
          <div className="card-head"><h3>Nuova fattura</h3><span className="status-chip">PayPal</span></div>
          <form className="stack-form" onSubmit={onSubmit}>
            <input value={form.customer} onChange={(e) => setForm({ ...form, customer: e.target.value })} placeholder="Cliente" />
            <input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="Importo" type="number" min="0" />
            <select value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
              <option value="Starter">Starter</option>
              <option value="Pro">Pro</option>
              <option value="Enterprice">Enterprice</option>
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as 'Draft' | 'Paid' | 'Overdue' })}>
              <option value="Draft">Draft</option>
              <option value="Paid">Paid</option>
              <option value="Overdue">Overdue</option>
            </select>
            <div className="form-actions">
              <button className="primary-button" type="submit">Genera fattura</button>
              <button className="secondary-button" type="button" onClick={() => setForm({ customer: '', amount: '', status: 'Draft', plan: 'Starter' })}>Reset</button>
            </div>
          </form>
        </article>
      </section>
    </div>
  )
}
