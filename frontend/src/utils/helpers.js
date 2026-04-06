// Format date to readable string
export const formatDate = (dateStr) => {
  if (!dateStr) return 'No due date'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

// Check if a date is overdue
export const isOverdue = (dateStr, status) => {
  if (!dateStr || status === 'COMPLETED') return false
  return new Date(dateStr) < new Date()
}

// Get days remaining/overdue text
export const getDueDateLabel = (dateStr, status) => {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dateStr)
  due.setHours(0, 0, 0, 0)
  const diff = Math.round((due - today) / (1000 * 60 * 60 * 24))

  if (status === 'COMPLETED') return null
  if (diff < 0) return `${Math.abs(diff)}d overdue`
  if (diff === 0) return 'Due today'
  if (diff === 1) return 'Due tomorrow'
  return `${diff}d remaining`
}

// Extract error message from axios error
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message
  if (error.response?.data) {
    // Validation errors come as { field: message }
    const msgs = Object.values(error.response.data)
    if (msgs.length) return msgs[0]
  }
  return error.message || 'Something went wrong'
}
