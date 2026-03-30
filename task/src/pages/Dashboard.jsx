import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getTasksByUser, getDashboardStats } from '../services/api'
import { Plus, Sparkles, Loader2, Calendar, Clock, CheckCircle2, Circle, Timer } from 'lucide-react'

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div className="stat-card slide-up">
      <div className="stat-icon" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        {sub && <p className="stat-sub">{sub}</p>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [tasks, setTasks]   = useState([])
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [aiInsight, setAiInsight] = useState('')
  const [analyzing, setAnalyzing] = useState(false)

  useEffect(() => {
    if (!user) return
    Promise.all([getTasksByUser(user.id), getDashboardStats()])
      .then(([userTasks, dashStats]) => {
        const normalized = (userTasks || []).map(item =>
          item.task ? { ...item.task } : item
        )
        setTasks(normalized)
        setStats(dashStats)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  const generateInsight = () => {
    setAnalyzing(true)
    setTimeout(() => {
      const todayStr = new Date().toISOString().split('T')[0]
      const overdue  = tasks.filter(t => t.dueDate && t.dueDate < todayStr && t.status !== 'COMPLETED')
      const today    = tasks.filter(t => t.dueDate === todayStr)
      if (tasks.length === 0) {
        setAiInsight('Your board is clear! Great time to plan ahead or take a well-deserved break. 🎉')
      } else if (overdue.length > 0) {
        setAiInsight(`You have ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}. Tackle those first before today's ${today.length} scheduled task${today.length !== 1 ? 's' : ''}. ⚡`)
      } else if (today.length > 3) {
        setAiInsight(`Busy day ahead with ${today.length} tasks! Focus on high-priority items first and batch similar work for maximum efficiency. 🔥`)
      } else if (today.length > 0) {
        setAiInsight(`You have ${today.length} task${today.length > 1 ? 's' : ''} for today. A steady pace will get you through comfortably. Keep going! 💪`)
      } else {
        setAiInsight('No tasks scheduled for today. Perfect opportunity to get ahead on backlog items! 🚀')
      }
      setAnalyzing(false)
    }, 1400)
  }

  // Derived values
  const total        = stats?.totalTasks   || 0
  const completed    = stats?.completed    || 0
  const inProgress   = stats?.inProgress   || 0
  const pending      = stats?.pending      || 0
  const progress     = total > 0 ? Math.round((completed / total) * 100) : 0

  const todayStr     = new Date().toISOString().split('T')[0]
  const todayTasks   = tasks.filter(t => t.dueDate === todayStr || !t.dueDate).slice(0, 5)

  // Calendar strip
  const now          = new Date()
  const days         = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const calDays      = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now); d.setDate(now.getDate() - now.getDay() + i)
    return { label: days[i], date: d.getDate(), isToday: i === now.getDay() }
  })

  // Today's timeline events
  const todayEvents = tasks
    .filter(t => t.dueDate === todayStr && t.startTime)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))

  const statusBadge = (s) => {
    if (s === 'COMPLETED')  return <span className="badge badge-completed"><CheckCircle2 size={10} />{s}</span>
    if (s === 'IN_PROGRESS')return <span className="badge badge-inprogress"><Timer size={10} />{s.replace('_',' ')}</span>
    return                         <span className="badge badge-pending"><Circle size={10} />{s || 'PENDING'}</span>
  }

  if (loading) return (
    <div className="spinner-wrap fade-in">
      <div className="spinner" />
    </div>
  )

  return (
    <div className="fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 4 }}>
            Hello, {user?.name?.split(' ')[0] || user?.email?.split('@')[0]}! 👋
          </p>
          <h1 className="page-title">
            You've got {todayTasks.length} task{todayTasks.length !== 1 ? 's' : ''} today
          </h1>
        </div>
        <Link to="/tasks" className="btn btn-primary">
          <Plus size={16} /> New Task
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard icon={<CheckCircle2 size={20} />} label="Total Tasks"   value={total}      color="#FACC15" sub="All time" />
        <StatCard icon={<CheckCircle2 size={20} />} label="Completed"     value={completed}  color="#22C55E" sub={`${progress}% done`} />
        <StatCard icon={<Timer size={20} />}         label="In Progress"   value={inProgress}  color="#3B82F6" />
        <StatCard icon={<Circle size={20} />}        label="Pending"       value={pending}     color="#A1A1AA" />
      </div>

      {/* Overall Progress */}
      <div className="card mb-24 slide-up-2" style={{ padding: '20px 28px' }}>
        <div className="flex-between mb-8">
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>Overall Progress</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--accent)' }}>{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="dashboard-grid">

        {/* Left — Task List */}
        <div>
          <div className="flex-between mb-16">
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>My Tasks</h2>
            <Link to="/tasks" style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 700 }}>View all →</Link>
          </div>

          {todayTasks.length === 0 ? (
            <div className="empty-state card">
              <CheckCircle2 size={40} />
              <h3>No tasks for today</h3>
              <p>Create a task to get started</p>
              <Link to="/tasks" className="btn btn-primary btn-sm mt-12">+ Add Task</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {todayTasks.map((task, i) => (
                <div key={task.id} className="task-card slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex-between">
                    <h3 className="task-title">{task.title}</h3>
                    {statusBadge(task.status)}
                  </div>
                  {task.description && <p className="task-desc">{task.description}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div className="task-meta">
                      <Clock size={12} />
                      {task.dueDate ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                      {task.startTime && <><span>·</span>{task.startTime.substring(0,5)}</>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, maxWidth: 140 }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div className="progress-fill" style={{ width: `${task.progress || 0}%` }} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{task.progress || 0}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Calendar Strip */}
          <div className="card mt-24">
            <div className="flex-between mb-16">
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                  {now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <h3 style={{ fontSize: 20, fontWeight: 800 }}>This Week</h3>
              </div>
              <Calendar size={18} style={{ color: 'var(--text-muted)' }} />
            </div>
            <div className="calendar-strip">
              {calDays.map(({ label, date, isToday }) => (
                <div key={label} className={`cal-day ${isToday ? 'today' : ''}`}>
                  <span className="cal-day-name">{label}</span>
                  <span className="cal-day-num">{date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Widgets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

          {/* AI Insight Widget */}
          <div className="ai-widget slide-up-2">
            <div className="ai-glow" />
            <div className="ai-header">
              <div className="ai-icon">✨</div>
              <div>
                <h3 className="ai-title">AI Assistant</h3>
                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Smart workload insights</p>
              </div>
            </div>
            {aiInsight ? (
              <div className="ai-insight-box">{aiInsight}</div>
            ) : (
              <p className="ai-body">
                Get an AI-powered analysis of your workload with smart prioritization tips based on your schedule.
              </p>
            )}
            <button
              className="btn btn-primary w-full"
              onClick={generateInsight}
              disabled={analyzing}
              style={{ position: 'relative', zIndex: 1 }}
            >
              {analyzing
                ? <><Loader2 size={14} style={{ animation: 'spin 0.7s linear infinite' }} />  Analyzing...</>
                : <><Sparkles size={14} /> Generate Insights</>
              }
            </button>
          </div>

          {/* Today's Timeline */}
          <div className="card slide-up-3">
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>Today's Schedule</h3>
            {todayEvents.length === 0 ? (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                No scheduled events with start times today.
              </p>
            ) : (
              <div className="timeline">
                {todayEvents.map((ev, i) => (
                  <div key={ev.id} className="timeline-item">
                    <div className="timeline-dot" />
                    <div style={{
                      background: i === 0 ? 'var(--accent)' : 'var(--bg-elevated)',
                      borderRadius: 'var(--r-lg)',
                      padding: '16px 20px',
                    }}>
                      <div className="flex-between" style={{ marginBottom: 4 }}>
                        <h4 style={{ fontSize: 14, fontWeight: 700, color: i === 0 ? '#000' : 'var(--text-primary)' }}>{ev.title}</h4>
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          padding: '3px 8px', borderRadius: 99,
                          background: i === 0 ? 'rgba(0,0,0,0.15)' : 'var(--bg-surface)',
                          color: i === 0 ? '#000' : 'var(--text-secondary)',
                        }}>
                          {ev.startTime.substring(0, 5)}
                        </span>
                      </div>
                      {ev.description && <p style={{ fontSize: 12, color: i === 0 ? 'rgba(0,0,0,0.6)' : 'var(--text-muted)' }}>{ev.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
