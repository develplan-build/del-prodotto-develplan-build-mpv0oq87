import { FormEvent, useState } from 'react'
import { useAppState } from '../App'

const columns: Array<'backlog' | 'progress' | 'review' | 'done'> = ['backlog', 'progress', 'review', 'done']
const labels: Record<(typeof columns)[number], string> = { backlog: 'Backlog', progress: 'In progress', review: 'Review', done: 'Done' }

export function TasksPage() {
  const { state, addTask, moveTask } = useAppState()
  const [form, setForm] = useState({ title: '', priority: 'Medium' as 'Low' | 'Medium' | 'High', column: 'backlog' as 'backlog' | 'progress' | 'review' | 'done' })

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.title) return
    addTask(form)
    setForm({ title: '', priority: 'Medium', column: 'backlog' })
  }

  const nextColumn = (column: 'backlog' | 'progress' | 'review' | 'done') => {
    const index = columns.indexOf(column)
    return columns[index + 1] || column
  }

  return (
    <div className="page-grid">
      <article className="glass-card form-card">
        <div className="card-head"><h3>Crea task operativo</h3><span className="status-chip">Kanban</span></div>
        <form className="stack-form inline-form" onSubmit={onSubmit}>
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titolo task" />
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as 'Low' | 'Medium' | 'High' })}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <select value={form.column} onChange={(e) => setForm({ ...form, column: e.target.value as 'backlog' | 'progress' | 'review' | 'done' })}>
            {columns.map((column) => <option key={column} value={column}>{labels[column]}</option>)}
          </select>
          <button className="primary-button" type="submit">Aggiungi task</button>
        </form>
      </article>

      <section className="kanban-grid">
        {columns.map((column) => (
          <article key={column} className="glass-card kanban-column">
            <div className="card-head"><h3>{labels[column]}</h3><span className="status-chip">{state.tasks[column].length}</span></div>
            {state.tasks[column].length === 0 ? (
              <div className="empty-state compact">Nessun task in {labels[column]}.</div>
            ) : (
              <div className="task-list">
                {state.tasks[column].map((task) => (
                  <div key={task.id} className="task-card">
                    <strong>{task.title}</strong>
                    <span className={`badge ${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'muted'}`}>{task.priority}</span>
                    <button className="table-action" onClick={() => moveTask(task.id, column, nextColumn(column))}>
                      {column === 'done' ? 'Resta fatto' : 'Sposta avanti'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  )
}
