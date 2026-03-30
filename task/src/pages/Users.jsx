import { useState, useEffect } from 'react'
import { getUsers } from '../services/api'
import { Users as UsersIcon, Mail } from 'lucide-react'

export default function Users() {
  const [users, setUsers]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUsers().then(setUsers).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-sub">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : users.length === 0 ? (
        <div className="empty-state card">
          <UsersIcon size={48} />
          <h3>No users found</h3>
          <p>Registered users will appear here.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img
                        src={u.profilePhoto || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                        alt={u.name}
                        style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-glass)' }}
                      />
                      <div>
                        <p style={{ fontWeight: 700, fontSize: 14 }}>{u.name}</p>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Member</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: 13 }}>
                      <Mail size={13} style={{ color: 'var(--text-muted)' }} />
                      {u.email}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-accent">#{u.id}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
