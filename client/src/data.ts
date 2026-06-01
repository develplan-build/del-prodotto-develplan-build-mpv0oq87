import { AppState } from './types'

export const createEmptyState = (): AppState => ({
  kpis: {
    generatedApps: 0,
    activeBuilds: 0,
    publishedProjects: 0,
    monthlyRevenue: 0
  },
  analytics: [],
  users: [],
  clients: [],
  tasks: {
    backlog: [],
    progress: [],
    review: [],
    done: []
  },
  invoices: [],
  invoiceSummary: {
    draft: 0,
    paid: 0,
    overdue: 0,
    recurring: 0
  },
  integrations: []
})
