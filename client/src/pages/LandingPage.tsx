import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../config'

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export function LandingPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setFeedback('')
    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Invio fallito')
      setFeedback('Messaggio inviato correttamente. Ti contatteremo a breve.')
      setForm({ name: '', email: '', message: '' })
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'Errore imprevisto.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <button className="nav-logo" onClick={() => scrollToId('hero')}>Develplan Build</button>
        <div className="landing-links">
          <button onClick={() => scrollToId('features')}>Funzionalità</button>
          <button onClick={() => scrollToId('workflow')}>Workflow</button>
          <button onClick={() => scrollToId('pricing')}>Prezzi</button>
          <button onClick={() => scrollToId('contact')}>Contatti</button>
          <button className="primary-button" onClick={() => navigate('/app/dashboard')}>Apri app</button>
        </div>
      </nav>

      <section id="hero" className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">AI software factory B2B</span>
          <h1>Descrivi la tua idea. Un AI Agent costruisce e pubblica l'intera applicazione.</h1>
          <p>
            Develplan Build genera frontend, backend, dashboard operativa e deployment pubblico in un unico workflow
            self-service pensato per team, agenzie e software studios.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => navigate('/app/dashboard')}>Apri la dashboard</button>
            <button className="secondary-button" onClick={() => scrollToId('features')}>Scopri le funzionalità</button>
          </div>
          <div className="hero-proof">
            <span>Wizard guidato</span>
            <span>Deploy con URL pubblico</span>
            <span>Controllo ruoli e fatturazione</span>
          </div>
        </div>
        <div className="hero-panel glass-card">
          <div className="panel-header">
            <span className="status-dot" />
            <strong>Build stream live</strong>
          </div>
          <div className="build-step"><span>01</span><p>Idea raccolta tramite wizard multi-step</p></div>
          <div className="build-step"><span>02</span><p>AI Agent orchestra frontend, API e dashboard admin</p></div>
          <div className="build-step"><span>03</span><p>Pubblicazione automatica con URL condivisibile</p></div>
        </div>
      </section>

      <section id="features" className="content-section">
        <div className="section-heading">
          <span className="eyebrow">Funzionalità</span>
          <h2>Una piattaforma completa per produrre software su scala</h2>
        </div>
        <div className="feature-grid">
          <article className="glass-card feature-card"><h3>AI build orchestration</h3><p>Wizard, generazione codice e supervisione del job in tempo reale.</p></article>
          <article className="glass-card feature-card"><h3>Stack end-to-end</h3><p>Frontend, backend, dashboard e asset storage in un unico flusso.</p></article>
          <article className="glass-card feature-card"><h3>Governance B2B</h3><p>Ruoli, clienti, task e fatturazione automatica già inclusi.</p></article>
        </div>
      </section>

      <section id="workflow" className="content-section alt-section">
        <div className="section-heading">
          <span className="eyebrow">Workflow</span>
          <h2>Dalla richiesta al deploy senza passaggi manuali dispersi</h2>
        </div>
        <div className="timeline">
          <div className="timeline-item glass-card"><strong>Brief</strong><p>L'utente definisce idea, target, stack e monetizzazione.</p></div>
          <div className="timeline-item glass-card"><strong>Build</strong><p>L'agente genera codice, struttura dati e area operativa.</p></div>
          <div className="timeline-item glass-card"><strong>Publish</strong><p>Il progetto viene esposto online e condiviso via URL pubblico.</p></div>
        </div>
      </section>

      <section id="pricing" className="content-section">
        <div className="section-heading">
          <span className="eyebrow">Prezzi</span>
          <h2>Piani trasparenti per team che vogliono costruire più velocemente</h2>
        </div>
        <div className="pricing-grid">
          <article className="glass-card price-card"><h3>Starter</h3><div className="price">49€/month</div><p>Per piccoli team che vogliono validare e pubblicare rapidamente.</p><button className="secondary-button" onClick={() => navigate('/app/dashboard')}>Scegli Starter</button></article>
          <article className="glass-card price-card featured"><h3>Pro</h3><div className="price">149€/month</div><p>Per aziende che gestiscono build continue, ruoli e pipeline clienti.</p><button className="primary-button" onClick={() => navigate('/app/dashboard')}>Scegli Pro</button></article>
          <article className="glass-card price-card"><h3>Enterprice</h3><div className="price">499€/month</div><p>Per organizzazioni con processi avanzati, governance e volumi elevati.</p><button className="secondary-button" onClick={() => navigate('/app/dashboard')}>Parla con sales</button></article>
        </div>
      </section>

      <section id="contact" className="content-section alt-section">
        <div className="section-heading">
          <span className="eyebrow">Contatti</span>
          <h2>Richiedi una demo o raccontaci la tua idea</h2>
        </div>
        <form className="contact-form glass-card" onSubmit={handleSubmit}>
          <div className="form-row">
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome" />
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" type="email" />
          </div>
          <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Descrivi il progetto o la demo che vuoi vedere" rows={5} />
          <div className="form-actions">
            <button className="primary-button" type="submit" disabled={submitting}>{submitting ? 'Invio in corso...' : 'Invia richiesta'}</button>
            <button className="secondary-button" type="button" onClick={() => setForm({ name: '', email: '', message: '' })}>Pulisci</button>
          </div>
          {feedback ? <p className="form-feedback">{feedback}</p> : null}
        </form>
      </section>
    </div>
  )
}
