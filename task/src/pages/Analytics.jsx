import { useState, useEffect } from 'react'
import { getDashboardStats, getTasks } from '../services/api'
import { BarChart3, CheckCircle2, Timer, Circle, TrendingUp } from 'lucide-react'

function CssBar({ value, max, color, label, count }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="bar-col">
      <span className="bar-value">{count}</span>
      <div className="bar" style={{
        height: `${Math.max(pct, 3)}%`,
        background: color,
        width: '100%',
        boxShadow: `0 0 12px ${color}66`,
      }} />
      <span className="bar-label">{label}</span>
    </div>
  )
}

export default function Analytics() {
  const [stats, setStats]     = useState(null)
  const [tasks, setTasks]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getDashboardStats(), getTasks()])
      .then(([s, t]) => { setStats(s); setTasks(t || []) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner-wrap fade-in"><div className="spinner" /></div>

  const total      = stats?.totalTasks  || 0
  const completed  = stats?.completed   || 0
  const inProgress = stats?.inProgress  || 0
  const pending    = stats?.pending     || 0
  const maxVal     = Math.max(completed, inProgress, pending, 1)
  const pctDone    = total > 0 ? Math.round((completed / total) * 100) : 0

  // Task types distribution
  const typeMap = {}
  tasks.forEach(t => { const k = t.type || 'Untyped'; typeMap[k] = (typeMap[k] || 0) + 1 })
  const typeEntries = Object.entries(typeMap).sort((a, b) => b[1] - a[1]).slice(0, 5)

  // Overdue tasks
  const todayStr = new Date().toISOString().split('T')[0]
  const overdue  = tasks.filter(t => t.dueDate && t.dueDate < todayStr && t.status !== 'COMPLETED')

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-sub">Performance overview of your task board</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        <div className="stat-card slide-up">
          <div className="stat-icon" style={{ background: 'rgba(250,204,21,0.12)', color: '#FACC15' }}>
            <BarChart3 size={20} />
          </div>
          <p className="stat-label">Total Tasks</p>
          <p className="stat-value">{total}</p>
        </div>
        <div className="stat-card slide-up">
          <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>
            <CheckCircle2 size={20} />
          </div>
          <p className="stat-label">Completed</p>
          <p className="stat-value">{completed}</p>
          <p className="stat-sub">{pctDone}% completion rate</p>
        </div>
        <div className="stat-card slide-up">
          <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.12)', color: '#3B82F6' }}>
            <Timer size={20} />
          </div>
          <p className="stat-label">In Progress</p>
          <p className="stat-value">{inProgress}</p>
        </div>
        <div className="stat-card slide-up">
          <div className="stat-icon" style={{ background: 'rgba(239,68,68,0.12)', color: '#EF4444' }}>
            <Circle size={20} />
          </div>
          <p className="stat-label">Overdue</p>
          <p className="stat-value">{overdue.length}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* Status Bar Chart */}
        <div className="card slide-up-2">
          <div className="flex-between mb-24">
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>Status Breakdown</h2>
            <TrendingUp size={18} style={{ color: 'var(--text-muted)' }} />
          </div>
          <div className="bar-chart">
            <CssBar value={completed}  max={maxVal} color="#22C55E" label="Completed"   count={completed} />
            <CssBar value={inProgress} max={maxVal} color="#3B82F6" label="In Progress" count={inProgress} />
            <CssBar value={pending}    max={maxVal} color="#FACC15" label="Pending"     count={pending} />
          </div>
          <div className="divider" />
          <div style={{ display: 'flex', gap: 20 }}>
            {[['#22C55E','Completed'],['#3B82F6','In Progress'],['#FACC15','Pending']].map(([c,l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c, display: 'inline-block' }} />
                {l}
              </div>
            ))}
          </div>
        </div>

        {/* Completion Donut (CSS) */}
        <div className="card slide-up-2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, alignSelf: 'flex-start' }}>Completion Rate</h2>
          <div style={{ position: 'relative', width: 160, height: 160 }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--bg-elevated)" strokeWidth="3.2" />
              <circle
                cx="18" cy="18" r="15.9"
                fill="none"
                stroke="#FACC15"
                strokeWidth="3.2"
                strokeDasharray={`${pctDone} ${100 - pctDone}`}
                strokeLinecap="round"
                style={{ transition: 'stroke-dasharray 1s ease', filter: 'drop-shadow(0 0 6px rgba(250,204,21,0.5))' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--accent)' }}>{pctDone}%</span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Done</span>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center' }}>
            {completed} of {total} tasks completed
          </p>
        </div>

        {/* Task Types */}
        <div className="card slide-up-3">
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>Task Types</h2>
          {typeEntries.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No typed tasks found.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {typeEntries.map(([type, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0
                return (
                  <div key={type}>
                    <div className="flex-between mb-8">
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{type}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>{count} ({pct}%)</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Overdue Tasks */}
        <div className="card slide-up-3">
          <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>
            Overdue Tasks
            {overdue.length > 0 && (
              <span className="badge badge-pending" style={{ marginLeft: 10, fontSize: 11 }}>{overdue.length}</span>
            )}
          </h2>
          {overdue.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '20px 0', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={36} style={{ color: '#22C55E', opacity: 0.6 }} />
              <p style={{ fontWeight: 600, fontSize: 14 }}>All caught up!</p>
              <p style={{ fontSize: 12 }}>No overdue tasks.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {overdue.slice(0, 5).map(t => (
                <div key={t.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 14px', background: 'rgba(239,68,68,0.06)',
                  border: '1px solid rgba(239,68,68,0.15)', borderRadius: 'var(--r-md)',
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{t.title}</span>
                  <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 700 }}>
                    Due {new Date(t.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
              {overdue.length > 5 && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>+{overdue.length - 5} more overdue</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
