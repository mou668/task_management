import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api/'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Inject JWT token on every request (Temporarily disabled to fix 403 errors)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers['Authorization'] = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Auto-logout on 401/403
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
    return Promise.reject(error)
  }
)

// ── Auth ──────────────────────────────────────────────────────────────────────
export const loginUser    = (creds)    => api.post('auth/login',    creds).then(r => r.data)
export const registerUser = (userData) => api.post('auth/register', userData).then(r => r.data)

// ── Users ─────────────────────────────────────────────────────────────────────
export const getUsers    = ()         => api.get('users').then(r => r.data)
export const createUser  = (data)     => api.post('users', data).then(r => r.data)

// ── Teams ─────────────────────────────────────────────────────────────────────
export const getTeams    = ()         => api.get('teams').then(r => r.data)
export const getTeamById = (id)       => api.get(`teams/${id}`).then(r => r.data)
export const createTeam  = (data)     => api.post('teams', data).then(r => r.data)
export const deleteTeam  = (id)       => api.delete(`teams/${id}`).then(r => r.data)

// ── Tasks ─────────────────────────────────────────────────────────────────────
export const getTasks          = ()         => api.get('tasks').then(r => r.data)
export const createTask        = (data)     => api.post('tasks', data).then(r => r.data)
export const updateTask        = (id, data) => api.put(`tasks/${id}`, data).then(r => r.data)
export const deleteTask        = (id)       => api.delete(`tasks/${id}`).then(r => r.data)
export const getTasksByUser    = (userId)   => api.get(`tasks/user/${userId}`).then(r => r.data)
export const getTasksByStatus  = (status)   => api.get(`tasks/status/${status}`).then(r => r.data)
export const getDashboardStats = ()         => api.get('tasks/dashboard').then(r => r.data)
export const getTasksByDate    = (date)     => api.get(`tasks/date/${date}`).then(r => r.data)

// ── Assignments ───────────────────────────────────────────────────────────────
export const getAssignments   = ()     => api.get('assignments').then(r => r.data)
export const assignTask       = (data) => api.post('assignments', data).then(r => r.data)
export const deleteAssignment = (id)   => api.delete(`assignments/${id}`).then(r => r.data)

// ── Documents ─────────────────────────────────────────────────────────────────
export const uploadDocument = (taskId, file) => {
  const fd = new FormData()
  fd.append('file', file)
  return axios.post(`${API_BASE_URL}documents/upload/${taskId}`, fd, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(r => r.data)
}

export const getDocuments = (taskId) => api.get(`documents/task/${taskId}`).then(r => r.data)

export default api
