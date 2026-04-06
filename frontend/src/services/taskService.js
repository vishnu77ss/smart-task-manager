import api from './api'

export const taskService = {
  // Fetch all tasks with optional filters
  getTasks: (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.status) params.append('status', filters.status)
    if (filters.priority) params.append('priority', filters.priority)
    return api.get(`/tasks?${params.toString()}`)
  },

  getTask: (id) => api.get(`/tasks/${id}`),

  getStats: () => api.get('/tasks/stats'),

  createTask: (data) => api.post('/tasks', data),

  updateTask: (id, data) => api.put(`/tasks/${id}`, data),

  deleteTask: (id) => api.delete(`/tasks/${id}`),
}
