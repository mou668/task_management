import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true); setError('')
    const result = await login(email, password)
    setLoading(false)
    if (result.success) navigate('/dashboard')
    else setError(result.error || 'Invalid credentials.')
  }

  return (
    <div className="auth-page">
      <div className="auth-glow-1" />
      <div className="auth-glow-2" />
      <div className="auth-glow-3" />

      <div className="auth-card fade-in">
        {/* Branding Panel */}
        <div className="auth-brand">
          <div className="auth-brand-deco-1" />
          <div className="auth-brand-deco-2" />
          <div className="auth-brand-deco-3" />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="auth-brand-logo">
              <div className="auth-brand-icon">T</div>
              <span className="auth-brand-name">TaskFlow</span>
            </div>
            <h1 className="auth-brand-headline">
              Manage your<br />
              <span>daily tasks.</span>
            </h1>
            <p className="auth-brand-sub">
              Streamline your workflow, collaborate with your team,
              and achieve your goals faster with our intuitive platform.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: 16, marginTop: 48 }}>
            {['Tasks', 'Teams', 'Analytics'].map(label => (
              <div key={label} style={{
                padding: '8px 16px',
                borderRadius: 99,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 12,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.6)',
              }}>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Form Panel */}
        <div className="auth-form-side slide-up">
          <h2 className="auth-form-title">Welcome back</h2>
          <p className="auth-form-sub">Enter your details to sign in to your account.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="error-alert">{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div className="input-group">
                <span className="input-icon"><Mail size={16} /></span>
                <input
                  id="login-email"
                  type="email"
                  className="form-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="input-group">
                <span className="input-icon"><Lock size={16} /></span>
                <input
                  id="login-password"
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button id="login-submit" type="submit" className="btn btn-primary w-full" style={{ marginTop: 4 }} disabled={loading}>
              {loading
                ? <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Signing in...</>
                : <><span>Sign In</span><ArrowRight size={16} /></>
              }
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
