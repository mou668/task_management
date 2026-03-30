import { createContext, useContext, useState, useEffect } from 'react'
import { loginUser, registerUser } from '../services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)

useEffect(() => {
const stored = localStorage.getItem('user')
if (stored) setUser(JSON.parse(stored))
setLoading(false)
}, [])

  const login = async (email, password) => {
    try {
      const res = await loginUser({ email, password })
      
      // Handle both nested { token, user: { ... } } and flat { token, id, name, ... } formats
      const token = res.token
      const userObj = res.user || res

      if (!token || (!userObj.id && !userObj.email)) {
        console.error('Login response missing token or user data:', res)
        return { success: false, error: 'Authorization failed. Invalid response from server.' }
      }

      const userData = {
        id: userObj.id,
        name: userObj.name || 'User',
        email: userObj.email,
        profilePhoto: userObj.profilePhoto || 
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'
      }

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }

    } catch (err) {
      console.error('Login error:', err)
      const msg =
        err.response?.data?.message ||
        'Invalid credentials. Please try again.'
      return { success: false, error: msg }
    }
  }

  const register = async (name, email, password, profilePhoto) => {
    try {
      const defaultAvatar =
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'

      const res = await registerUser({
        name,
        email,
        password,
        profilePhoto: profilePhoto || defaultAvatar
      })

      // Handle both nested { token, user: { ... } } and flat { token, id, name, ... } formats
      const token = res.token
      const userObj = res.user || res

      if (!token || (!userObj.id && !userObj.email)) {
        console.error('Registration response missing token or user data:', res)
        return { success: false, error: 'Registration failed. Invalid response from server.' }
      }

      const userData = {
        id: userObj.id,
        name: userObj.name || name || 'User',
        email: userObj.email || email,
        profilePhoto: userObj.profilePhoto || profilePhoto || defaultAvatar
      }

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      return { success: true }

    } catch (err) {
      console.error('Registration error:', err)
      const msg =
        err.response?.data?.message ||
        'Registration failed. Email may already be in use.'
      return { success: false, error: msg }
    }
  }

const logout = () => {
setUser(null)
localStorage.removeItem('token')
localStorage.removeItem('user')
}

return (
<AuthContext.Provider value={{ user, login, register, logout, loading }}>
{!loading && children}
</AuthContext.Provider>
)
}

export const useAuth = () => useContext(AuthContext)
