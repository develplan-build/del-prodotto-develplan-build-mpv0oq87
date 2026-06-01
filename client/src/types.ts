export type UserRole = 'Admin' | 'Builder' | 'Viewer'
export type UserStatus = 'Active' | 'Invited' | 'Suspended'
export type ClientStatus = 'Lead' | 'Qualified' | 'Customer'
export type TaskPriority = 'Low' | 'Medium' | 'High'
export type InvoiceStatus = 'Draft' | 'Paid' | 'Overdue'

export interface UserItem {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
}

export interface ClientItem {
  id: string
  company: string
  owner: string
  email: string
  status: ClientStatus
}

export interface TaskItem {
  id: string
  title: string
  priority: TaskPriority
}

export interface InvoiceItem {
  id: string
  customer: string
  amount: number
  status: InvoiceStatus
  plan: string
}

export interface AnalyticsPoint {
  name: string
  builds: number
  deploys: number
}

export interface IntegrationStatus {
  key: string
  configured: boolean
  status: string
}

export interface AppState {
  kpis: {
    generatedApps: number
    activeBuilds: number
    publishedProjects: number
    monthlyRevenue: number
  }
  analytics: AnalyticsPoint[]
  users: UserItem[]
  clients: ClientItem[]
  tasks: {
    backlog: TaskItem[]
    progress: TaskItem[]
    review: TaskItem[]
    done: TaskItem[]
  }
  invoices: InvoiceItem[]
  invoiceSummary: {
    draft: number
    paid: number
    overdue: number
    recurring: number
  }
  integrations: IntegrationStatus[]
}
