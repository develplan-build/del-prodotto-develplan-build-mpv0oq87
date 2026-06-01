const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const envStatus = (key) => ({
  key,
  configured: Boolean(process.env[key]),
  status: process.env[key] ? 'Configurato' : 'Da configurare'
});

const emptyState = {
  kpis: {
    generatedApps: 0,
    activeBuilds: 0,
    publishedProjects: 0,
    monthlyRevenue: 0
  },
  analytics: [],
  users: [],
  clients: [],
  tasks: [],
  invoices: []
};

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', product: 'Develplan Build', timestamp: new Date().toISOString() });
});

app.get('/api/dashboard', (req, res) => {
  res.json({
    ...emptyState,
    integrations: [
      envStatus('SUPABASE_URL'),
      envStatus('SUPABASE_ANON_KEY'),
      envStatus('RESEND_API_KEY'),
      envStatus('GOOGLE_CLIENT_ID'),
      envStatus('GITHUB_CLIENT_ID'),
      envStatus('SLACK_BOT_TOKEN'),
      envStatus('PAYPAL_CLIENT_ID'),
      envStatus('MICROSOFT_CLIENT_ID'),
      envStatus('APPLE_CLIENT_ID'),
      envStatus('OPENAI_API_KEY'),
      envStatus('GA_MEASUREMENT_ID'),
      envStatus('SENTRY_DSN'),
      envStatus('INTERCOM_APP_ID'),
      envStatus('DISCORD_CLIENT_ID'),
      envStatus('NOTION_TOKEN'),
      envStatus('AWS_ACCESS_KEY_ID')
    ]
  });
});

app.get('/api/users', (req, res) => {
  res.json({ items: [] });
});

app.get('/api/clients', (req, res) => {
  res.json({ items: [] });
});

app.get('/api/tasks', (req, res) => {
  res.json({ columns: { backlog: [], progress: [], review: [], done: [] } });
});

app.get('/api/invoices', (req, res) => {
  res.json({ items: [], summary: { draft: 0, paid: 0, overdue: 0, recurring: 0 } });
});

app.get('/api/integrations', (req, res) => {
  res.json({
    providers: {
      supabase: {
        url: process.env.SUPABASE_URL || '',
        configured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY)
      },
      resend: { configured: Boolean(process.env.RESEND_API_KEY) },
      google: { configured: Boolean(process.env.GOOGLE_CLIENT_ID) },
      github: { configured: Boolean(process.env.GITHUB_CLIENT_ID) },
      slack: { configured: Boolean(process.env.SLACK_BOT_TOKEN) },
      paypal: { configured: Boolean(process.env.PAYPAL_CLIENT_ID) },
      microsoft: { configured: Boolean(process.env.MICROSOFT_CLIENT_ID) },
      apple: { configured: Boolean(process.env.APPLE_CLIENT_ID) },
      openai: { configured: Boolean(process.env.OPENAI_API_KEY) },
      analytics: { configured: Boolean(process.env.GA_MEASUREMENT_ID) },
      sentry: { configured: Boolean(process.env.SENTRY_DSN) },
      intercom: { configured: Boolean(process.env.INTERCOM_APP_ID) },
      discord: { configured: Boolean(process.env.DISCORD_CLIENT_ID) },
      notion: { configured: Boolean(process.env.NOTION_TOKEN) },
      s3: {
        configured: Boolean(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_REGION)
      }
    }
  });
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Tutti i campi sono obbligatori.' });
  }

  res.json({
    success: true,
    submittedAt: new Date().toISOString(),
    delivery: process.env.RESEND_API_KEY ? 'Pronto per invio con Resend' : 'Salvato localmente - Resend da configurare'
  });
});

app.post('/api/ai/generate', (req, res) => {
  const { idea, audience, stackPreference, monetization } = req.body || {};
  if (!idea || !audience || !stackPreference || !monetization) {
    return res.status(400).json({ error: 'Compila tutti i campi del wizard.' });
  }

  const openAIConfigured = Boolean(process.env.OPENAI_API_KEY);
  res.json({
    success: true,
    mode: openAIConfigured ? 'live' : 'simulation',
    openAIConfigured,
    blueprint: {
      productSummary: `Piattaforma per ${audience} con stack ${stackPreference}`,
      modules: ['Frontend', 'Backend', 'Dashboard', 'Deploy'],
      monetization,
      nextStep: openAIConfigured ? 'Invio del prompt all\'agent AI disponibile' : 'Configura OPENAI_API_KEY per attivare la generazione live'
    }
  });
});

app.get('/api/demo/dashboard', (req, res) => {
  res.json({
    kpis: {
      generatedApps: 14,
      activeBuilds: 3,
      publishedProjects: 11,
      monthlyRevenue: 12640
    },
    analytics: [
      { name: 'Lun', builds: 2, deploys: 1 },
      { name: 'Mar', builds: 4, deploys: 3 },
      { name: 'Mer', builds: 3, deploys: 2 },
      { name: 'Gio', builds: 5, deploys: 4 },
      { name: 'Ven', builds: 6, deploys: 5 }
    ]
  });
});

app.get('/api/demo/users', (req, res) => {
  res.json({
    items: [
      { id: 'u1', name: 'Giulia Conti', email: 'giulia@acme.io', role: 'Admin', status: 'Active' },
      { id: 'u2', name: 'Marco Bianchi', email: 'marco@acme.io', role: 'Builder', status: 'Invited' }
    ]
  });
});

app.get('/api/demo/clients', (req, res) => {
  res.json({
    items: [
      { id: 'c1', company: 'Northstar Labs', owner: 'Elena Serra', email: 'ops@northstarlabs.com', status: 'Qualified' },
      { id: 'c2', company: 'Flux Digital', owner: 'Davide Riva', email: 'hello@fluxdigital.co', status: 'Customer' }
    ]
  });
});

app.get('/api/demo/tasks', (req, res) => {
  res.json({
    columns: {
      backlog: [{ id: 't1', title: 'Definisci prompt iniziale', priority: 'High' }],
      progress: [{ id: 't2', title: 'Genera backend API', priority: 'Medium' }],
      review: [{ id: 't3', title: 'Verifica deploy sandbox', priority: 'Medium' }],
      done: [{ id: 't4', title: 'Crea landing page', priority: 'Low' }]
    }
  });
});

app.get('/api/demo/invoices', (req, res) => {
  res.json({
    items: [
      { id: 'i1', customer: 'Northstar Labs', amount: 1490, status: 'Paid', plan: 'Pro' },
      { id: 'i2', customer: 'Flux Digital', amount: 4990, status: 'Draft', plan: 'Enterprise' }
    ],
    summary: { draft: 1, paid: 1, overdue: 0, recurring: 2 }
  });
});

app.listen(4000, '0.0.0.0', () => {
  console.log('Backend Develplan Build in esecuzione su porta 4000');
});
