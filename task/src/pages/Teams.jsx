import { useState, useEffect } from 'react'
import { getTeams, createTeam, deleteTeam } from '../services/api'
import Modal from '../components/Modal'
import { Plus, Trash2, UsersRound, Loader2 } from 'lucide-react'

export default function Teams() {
  const [teams, setTeams]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [isOpen, setIsOpen]     = useState(false)
  const [name, setName]         = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getTeams().then(data => setTeams(Array.isArray(data) ? data : [])).catch(console.error).finally(() => setLoading(false))
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    try {
      const team = await createTeam({ name })
      setTeams(prev => [team, ...prev])
      setIsOpen(false); setName('')
      alert('Team created successfully!')
    } catch (e) { 
      console.error('Create team error:', e)
      const msg = e.response?.data?.message || e.message || 'Unknown error'
      alert('Failed to create team: ' + msg)
    }
    finally { setSubmitting(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this team?')) return
    try {
      await deleteTeam(id)
      setTeams(prev => prev.filter(t => t.id !== id))
    } catch (e) { console.error(e) }
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Teams</h1>
          <p className="page-sub">Manage your organisation's teams</p>
        </div>
        <button id="open-create-team" className="btn btn-primary" onClick={() => setIsOpen(true)}>
          <Plus size={16} /> New Team
        </button>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : teams.length === 0 ? (
        <div className="empty-state card">
          <UsersRound size={48} />
          <h3>No teams yet</h3>
          <p>Create a team to start collaborating.</p>
          <button className="btn btn-primary btn-sm mt-12" onClick={() => setIsOpen(true)}>+ Create Team</button>
        </div>
      ) : (
        <div className="grid-3">
          {teams.map((team, i) => (
            <div key={team.id} className="card slide-up" style={{ animationDelay: `${i * 0.05}s`, transition: 'all 0.25s' }}>
              <div className="flex-between">
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--r-md)',
                  background: 'var(--accent)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 800, color: '#000',
                }}>
                  {team.name?.charAt(0).toUpperCase()}
                </div>
                <button className="btn btn-danger btn-sm btn-icon" onClick={() => handleDelete(team.id)} title="Delete team">
                  <Trash2 size={13} />
                </button>
              </div>
              <div style={{ marginTop: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>{team.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                  <UsersRound size={13} />
                  <span>Team #{team.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create Team">
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label className="form-label">Team Name *</label>
            <input required className="form-input" placeholder="e.g. Design Squad" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
            {submitting ? <><Loader2 size={14} style={{ animation: 'spin 0.7s linear infinite' }} /> Creating...</> : 'Create Team'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
