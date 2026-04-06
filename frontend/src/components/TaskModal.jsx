import { useState, useEffect } from 'react'
import { taskService } from '../services/taskService'
import { getErrorMessage } from '../utils/helpers'

const DEFAULT_FORM = {
  title: '',
  description: '',
  priority: 'MEDIUM',
  status: 'PENDING',
  dueDate: '',
}

export default function TaskModal({ isOpen, onClose, onSave, task }) {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEditing = !!task

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        status: task.status || 'PENDING',
        dueDate: task.dueDate || '',
      })
    } else {
      setForm(DEFAULT_FORM)
    }
    setError('')
  }, [task, isOpen])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required'); return }

    setLoading(true)
    setError('')

    try {
      const payload = { ...form, dueDate: form.dueDate || null }
      if (isEditing) {
        await taskService.updateTask(task.id, payload)
      } else {
        await taskService.createTask(payload)
      }
      onSave()
      onClose()
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass-card border border-slate-700/60 shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing ? 'Update task details below' : 'Fill in the details for your new task'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="label">Title <span className="text-red-400">*</span></label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              className="input-field"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add more details (optional)..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Priority + Status row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className="input-field">
                <option value="HIGH">🔴 High</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="LOW">🟢 Low</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select name="status" value={form.status} onChange={handleChange} className="input-field">
                <option value="PENDING">⏳ Pending</option>
                <option value="COMPLETED">✅ Completed</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label className="label">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={form.dueDate}
              onChange={handleChange}
              className="input-field"
              style={{ colorScheme: 'dark' }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                isEditing ? 'Save Changes' : 'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
