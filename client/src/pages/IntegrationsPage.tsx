import { useMemo, useState } from 'react'
import { useAppState } from '../App'

const services = [
  'Supabase', 'Resend', 'Google Login', 'GitHub Login', 'Slack', 'PayPal', 'Microsoft Login', 'Apple Login',
  'OpenAI', 'Google Analytics', 'Sentry', 'Intercom', 'Discord', 'Notion', 'AWS S3'
]

const envMap: Record<string, string> = {
  'Supabase': 'SUPABASE_URL / SUPABASE_ANON_KEY',
  'Resend': 'RESEND_API_KEY',
  'Google Login': 'VITE_GOOGLE_CLIENT_ID',
  'GitHub Login': 'VITE_GITHUB_CLIENT_ID',
  'Slack': 'SLACK_BOT_TOKEN',
  'PayPal': 'PAYPAL_CLIENT_ID',
  'Microsoft Login': 'MICROSOFT_CLIENT_ID',
  'Apple Login': 'APPLE_CLIENT_ID',
  'OpenAI': 'OPENAI_API_KEY',
  'Google Analytics': 'GA_MEASUREMENT_ID',
  'Sentry': 'SENTRY_DSN',
  'Intercom': 'INTERCOM_APP_ID',
  'Discord': 'DISCORD_CLIENT_ID',
  'Notion': 'NOTION_TOKEN',
  'AWS S3': 'AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_REGION'
}

const backendKeyMap: Record<string, string> = {
  'Supabase': 'SUPABASE_URL',
  'Resend': 'RESEND_API_KEY',
  'Google Login': 'GOOGLE_CLIENT_ID',
  'GitHub Login': 'GITHUB_CLIENT_ID',
  'Slack': 'SLACK_BOT_TOKEN',
  'PayPal': 'PAYPAL_CLIENT_ID',
  'Microsoft Login': 'MICROSOFT_CLIENT_ID',
  'Apple Login': 'APPLE_CLIENT_ID',
  'OpenAI': 'OPENAI_API_KEY',
  'Google Analytics': 'GA_MEASUREMENT_ID',
  'Sentry': 'SENTRY_DSN',
  'Intercom': 'INTERCOM_APP_ID',
  'Discord': 'DISCORD_CLIENT_ID',
  'Notion': 'NOTION_TOKEN',
  'AWS S3': 'AWS_ACCESS_KEY_ID'
}

export function IntegrationsPage() {
  const { state, setNotice } = useAppState()
  const [selected, setSelected] = useState('Supabase')
  const configuredKeys = useMemo(() => new Map(state.integrations.map((item) => [item.key, item])), [state.integrations])
  const frontendEnv = (import.meta as ImportMeta & { env: Record<string, string | undefined> }).env
  const frontendConfigured = Boolean(frontendEnv[envMap[selected].split(' / ')[0]])
  const backendStatus = configuredKeys.get(backendKeyMap[selected])?.status || 'Da configurare'

  return (
    <div className="page-grid">
      <section className="two-column-layout integrations-layout">
        <article className="glass-card data-card">
          <div className="card-head"><h3>Catalogo integrazioni</h3><span className="status-chip">15 servizi</span></div>
          <div className="integration-list">
            {services.map((service) => (
              <button key={service} className={selected === service ? 'integration-button active' : 'integration-button'} onClick={() => setSelected(service)}>
                <span>{service}</span>
                <span className={configuredKeys.get(backendKeyMap[service])?.configured ? 'badge success' : 'badge muted'}>
                  {configuredKeys.get(backendKeyMap[service])?.configured ? 'Ready' : 'Setup'}
                </span>
              </button>
            ))}
          </div>
        </article>

        <article className="glass-card detail-card">
          <div className="card-head"><h3>{selected}</h3><span className="status-chip">Environment</span></div>
          <div className="detail-stack">
            <p>Questa integrazione è predisposta nel codice per usare variabili d'ambiente reali, mai chiavi hardcoded.</p>
            <div className="detail-row"><strong>Variabili richieste</strong><span>{envMap[selected]}</span></div>
            <div className="detail-row"><strong>Stato frontend</strong><span>{frontendConfigured ? 'Configurato' : 'Da configurare'}</span></div>
            <div className="detail-row"><strong>Stato backend</strong><span>{backendStatus}</span></div>
            <div className="social-buttons">
              <button className="secondary-button" onClick={() => setNotice(`${selected}: apri il pannello environment e configura ${envMap[selected]}.`)}>
                Connetti {selected}
              </button>
              <button className="secondary-button" onClick={() => { setSelected('OpenAI'); setNotice('Setup AI aperto: configura OPENAI_API_KEY per la generazione live.') }}>
                Apri setup AI
              </button>
            </div>
          </div>
        </article>
      </section>
    </div>
  )
}
