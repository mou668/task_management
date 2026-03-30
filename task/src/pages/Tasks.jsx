import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  getTasks, createTask, updateTask, deleteTask,
  uploadDocument, getDocuments,
} from '../services/api'
import Modal from '../components/Modal'
import {
  Plus, CheckSquare, Clock, Trash2,
  UploadCloud, FileText, Loader2, CheckCircle2, Timer, Circle,
} from 'lucide-react'

const STATUSES = ['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED']

const statusClass = (s) => {
  if (s === 'COMPLETED')  return 'badge badge-completed'
  if (s === 'IN_PROGRESS')return 'badge badge-inprogress'
  return 'badge badge-pending'
}

export default function Tasks() {
  const { user }   = useAuth()
  const [tasks, setTasks]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('ALL')
  const [isCreateOpen, setIsCreateOpen]   = useState(false)
  const [isDocOpen, setIsDocOpen]         = useState(false)
  const [docs, setDocs]   = useState([])
  const [docsLoading, setDocsLoading]     = useState(false)
  const [submitting, setSubmitting]       = useState(false)

  // Form state
  const [form, setForm] = useState({ title:'', description:'', status:'PENDING', dueDate:'', startTime:'', type:'', progress:0 })
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const data = await getTasks()
      setTasks(data || [])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = { ...form, progress: Number(form.progress) }
      // Only send dueDate if it's set, otherwise omit it so backend won't fail to parse ""
      if (!payload.dueDate) delete payload.dueDate

      const task = await createTask(payload)
      setTasks(prev => [task, ...prev])
      setIsCreateOpen(false)
      setForm({ title:'', description:'', status:'PENDING', dueDate:'', startTime:'', type:'', progress:0 })
      alert('Task created successfully!')
    } catch(e) { 
      console.error('Task creation error:', e)
      const msg = e.response?.data?.message || e.message || 'Unknown error'
      alert('Failed to create task: ' + msg)
    }
    finally { setSubmitting(false) }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const t = tasks.find(x => x.id === taskId)
      const updated = await updateTask(taskId, { ...t, status: newStatus })
      setTasks(prev => prev.map(x => x.id === taskId ? updated : x))
    } catch (e) { console.error(e) }
  }

  const handleDelete = async (taskId) => {
    if (!confirm('Delete this task?')) return
    try {
      await deleteTask(taskId)
      setTasks(prev => prev.filter(x => x.id !== taskId))
    } catch (e) { console.error(e) }
  }

  const handleUpload = async (taskId, file) => {
    if (!file) return
    try {
      await uploadDocument(taskId, file)
      alert('Document uploaded successfully!')
    } catch (e) { alert('Upload failed. Please try again.') }
  }

  const handleOpenDocs = async (taskId) => {
    setIsDocOpen(true); setDocsLoading(true); setDocs([])
    try {
      const d = await getDocuments(taskId)
      setDocs(d || [])
    } catch (e) { console.error(e) }
    finally { setDocsLoading(false) }
  }

  const filtered = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter)

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="page-sub">Manage and track all your project tasks</p>
        </div>
        <button id="open-create-task" className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="tabs">
        {STATUSES.map(s => (
          <button key={s} className={`tab-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
            {s === 'IN_PROGRESS' ? 'In Progress' : s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Task Grid */}
      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state card">
          <CheckSquare size={48} />
          <h3>No tasks found</h3>
          <p>{filter === 'ALL' ? 'Create your first task to get started.' : `No ${filter.toLowerCase()} tasks.`}</p>
          {filter === 'ALL' && (
            <button className="btn btn-primary btn-sm mt-12" onClick={() => setIsCreateOpen(true)}>+ New Task</button>
          )}
        </div>
      ) : (
        <div className="grid-3">
          {filtered.map((task, i) => (
            <div key={task.id} className="task-card slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className="flex-between">
                <span className={statusClass(task.status)}>
                  {task.status === 'COMPLETED'  && <CheckCircle2 size={10} />}
                  {task.status === 'IN_PROGRESS' && <Timer size={10} />}
                  {(!task.status || task.status === 'PENDING') && <Circle size={10} />}
                  {(task.status || 'PENDING').replace('_', ' ')}
                </span>
                <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(task.id)} title="Delete task">
                  <Trash2 size={13} />
                </button>
              </div>

              <div>
                <h3 className="task-title">{task.title}</h3>
                {task.description && <p className="task-desc mt-8">{task.description}</p>}
              </div>

              <div className="task-meta">
                <Clock size={12} />
                {task.dueDate ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No due date'}
                {task.type && <><span>·</span><span className="badge badge-accent" style={{ padding: '2px 8px', fontSize: 10 }}>{task.type}</span></>}
              </div>

              {/* Progress */}
              <div>
                <div className="flex-between mb-8">
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>Progress</span>
                  <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 800 }}>{task.progress || 0}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${task.status === 'COMPLETED' ? 'green' : task.status === 'IN_PROGRESS' ? 'blue' : ''}`}
                    style={{ width: `${task.progress || 0}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  className="form-select"
                  style={{ flex: 2, padding: '8px 12px', fontSize: 12 }}
                  value={task.status || 'PENDING'}
                  onChange={e => handleStatusChange(task.id, e.target.value)}
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>

                <label
                  htmlFor={`upload-${task.id}`}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, justifyContent: 'center', cursor: 'pointer' }}
                  title="Upload document"
                >
                  <UploadCloud size={13} />
                  <input
                    id={`upload-${task.id}`}
                    type="file"
                    style={{ display: 'none' }}
                    onChange={e => handleUpload(task.id, e.target.files[0])}
                  />
                </label>

                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => handleOpenDocs(task.id)}
                  title="View documents"
                >
                  <FileText size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Task">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label className="form-label">Title *</label>
            <input required className="form-input" placeholder="Task title" value={form.title} onChange={e => setField('title', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" placeholder="Describe the task..." value={form.description} onChange={e => setField('description', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => setField('status', e.target.value)}>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <input className="form-input" placeholder="e.g. Bug, Feature" value={form.type} onChange={e => setField('type', e.target.value)} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input type="date" className="form-input" value={form.dueDate} onChange={e => setField('dueDate', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input type="time" className="form-input" value={form.startTime} onChange={e => setField('startTime', e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Progress: {form.progress}%</label>
            <input type="range" min="0" max="100" value={form.progress} onChange={e => setField('progress', e.target.value)}
              style={{ accentColor: 'var(--accent)', width: '100%' }} />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
            {submitting ? <><Loader2 size={14} style={{ animation: 'spin 0.7s linear infinite' }} /> Saving...</> : 'Create Task'}
          </button>
        </form>
      </Modal>

      {/* Documents Modal */}
      <Modal isOpen={isDocOpen} onClose={() => setIsDocOpen(false)} title="Task Documents">
        {docsLoading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : docs.length === 0 ? (
          <div className="empty-state" style={{ padding: '32px 0' }}>
            <FileText size={36} />
            <h3>No documents</h3>
            <p>Upload a file from the task card to attach documents.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {docs.map(doc => (
              <div key={doc.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', background: 'var(--bg-elevated)',
                borderRadius: 'var(--r-md)', border: '1px solid var(--border-glass)',
              }}>
                <FileText size={16} style={{ color: 'var(--accent)' }} />
                <span style={{ flex: 1, fontSize: 14 }}>{doc.fileName}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>#{doc.id}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  )
}
