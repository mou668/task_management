import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, CheckSquare, Users, UsersRound,
  Link2, BarChart3, LogOut,
} from 'lucide-react'

const navLinks = [
  { to: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/tasks',       label: 'Tasks',        icon: CheckSquare },
  { to: '/teams',       label: 'Teams',        icon: UsersRound },
  { to: '/users',       label: 'Users',        icon: Users },
  { to: '/assignments', label: 'Assignments',  icon: Link2 },
  { to: '/analytics',   label: 'Analytics',    icon: BarChart3 },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">T</div>
        <span className="sidebar-logo-text">TaskFlow</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <span className="sidebar-label">Menu</span>
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-card">
          <img
            className="user-avatar"
            src={user?.profilePhoto || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
            alt="Profile"
          />
          <div className="user-info">
            <p className="user-name">{user?.name || 'User'}</p>
            <p className="user-role">{user?.email}</p>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={16} />
          Log Out
        </button>
      </div>
    </aside>
  )
}
