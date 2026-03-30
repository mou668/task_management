import { useState, useEffect } from 'react'
import { getAssignments, assignTask, deleteAssignment, getTasks, getUsers } from '../services/api'
import Modal from '../components/Modal'
import { Plus, Trash2, Link2, Loader2, User, CheckSquare } from 'lucide-react'

export default function Assignments() {
  const [assignments, setAssignments] = useState([])
  const [tasks, setTasks]   = useState([])
  const [users, setUsers]   = useState([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [taskId, setTaskId] = useState('')
  const [userId, setUserId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([getAssignments(), getTasks(), getUsers()])
      .then(([a, t, u]) => { setAssignments(a || []); setTasks(t || []); setUsers(u || []) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleAssign = async (e) => {
    e.preventDefault()
    if (!taskId || !userId) return
    setSubmitting(true)
    try {
      const result = await assignTask({ taskId: Number(taskId), userId: Number(userId) })
      setAssignments(prev => [result, ...prev])
      setIsOpen(false); setTaskId(''); setUserId('')
    } catch (e) { console.error(e) }
    finally { setSubmitting(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this assignment?')) return
    try {
      await deleteAssignment(id)
      setAssignments(prev => prev.filter(a => a.id !== id))
    } catch (e) { console.error(e) }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assignments</h1>
          <p className="page-sub">Link tasks to team members</p>
        </div>
        <button id="open-assign-task" className="btn btn-primary" onClick={() => setIsOpen(true)}>
          <Plus size={16} /> Assign Task
        </button>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : assignments.length === 0 ? (
        <div className="empty-state card">
          <Link2 size={48} />
          <h3>No assignments yet</h3>
          <p>Assign tasks to users to track accountability.</p>
          <button className="btn btn-primary btn-sm mt-12" onClick={() => setIsOpen(true)}>+ Assign Task</button>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Task</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map(a => (
                <tr key={a.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>#{a.id}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckSquare size={14} style={{ color: 'var(--accent)' }} />
                      <span style={{ fontWeight: 600 }}>{a.task?.title || `Task #${a.taskId}`}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <img
                        src={a.user?.profilePhoto || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                        alt=""
                        style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontSize: 13 }}>{a.user?.name || `User #${a.userId}`}</span>
                    </div>
                  </td>
                  <td>
                    {a.task?.status === 'COMPLETED'
                      ? <span className="badge badge-completed">Completed</span>
                      : a.task?.status === 'IN_PROGRESS'
                      ? <span className="badge badge-inprogress">In Progress</span>
                      : <span className="badge badge-pending">Pending</span>
                    }
                  </td>
                  <td>
                    <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(a.id)} title="Remove assignment">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Assign Task to User">
        <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label className="form-label"><CheckSquare size={13} style={{ display: 'inline', marginRight: 4 }} />Task *</label>
            <select required className="form-select" value={taskId} onChange={e => setTaskId(e.target.value)}>
              <option value="">Select a task…</option>
              {tasks.map(t => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label"><User size={13} style={{ display: 'inline', marginRight: 4 }} />User *</label>
            <select required className="form-select" value={userId} onChange={e => setUserId(e.target.value)}>
              <option value="">Select a user…</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
            {submitting ? <><Loader2 size={14} style={{ animation: 'spin 0.7s linear infinite' }} /> Assigning...</> : 'Assign Task'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
