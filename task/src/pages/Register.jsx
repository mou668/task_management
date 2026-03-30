import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const { register } = useAuth()
  const navigate      = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) { setError('Please fill in all fields.'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true); setError('')
    const result = await register(name, email, password)
    setLoading(false)
    if (result.success) navigate('/dashboard')
    else setError(result.error || 'Registration failed.')
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
              Start organizing<br />
              <span>smarter today.</span>
            </h1>
            <p className="auth-brand-sub">
              Join thousands of teams who use TaskFlow to manage projects,
              track progress, and hit their deadlines every time.
            </p>
          </div>

          <div style={{ position: 'relative', zIndex: 1, marginTop: 48 }}>
            <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <span key={i} style={{ fontSize: 18, color: '#FACC15' }}>★</span>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic' }}>
              "TaskFlow transformed how our team collaborates — we're shipping 40% faster."
            </p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 8 }}>— Product Manager, TechCorp</p>
          </div>
        </div>

        {/* Form Panel */}
        <div className="auth-form-side slide-up">
          <h2 className="auth-form-title">Create account</h2>
          <p className="auth-form-sub">Get started for free. No credit card required.</p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="error-alert">{error}</div>}

            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <div className="input-group">
                <span className="input-icon"><User size={16} /></span>
                <input
                  id="reg-name"
                  type="text"
                  className="form-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <div className="input-group">
                <span className="input-icon"><Mail size={16} /></span>
                <input
                  id="reg-email"
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
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="input-group">
                <span className="input-icon"><Lock size={16} /></span>
                <input
                  id="reg-password"
                  type="password"
                  className="form-input"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <button id="register-submit" type="submit" className="btn btn-primary w-full" style={{ marginTop: 4 }} disabled={loading}>
              {loading
                ? <><Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> Creating account...</>
                : <><span>Create Account</span><ArrowRight size={16} /></>
              }
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
