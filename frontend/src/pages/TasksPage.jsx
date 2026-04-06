import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { taskService } from '../services/taskService'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import ConfirmModal from '../components/ConfirmModal'
import Sidebar from '../components/Sidebar'

const STATUSES  = ['ALL', 'PENDING', 'COMPLETED']
const PRIORITIES = ['ALL', 'HIGH', 'MEDIUM', 'LOW']

export default function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [taskModal, setTaskModal] = useState({ open: false, task: null })
  const [confirmModal, setConfirmModal] = useState({ open: false, taskId: null })
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [search, setSearch] = useState('')

  // Read filters from URL params (or default ALL)
  const statusFilter   = searchParams.get('status')   || 'ALL'
  const priorityFilter = searchParams.get('priority') || 'ALL'

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const filters = {}
      if (statusFilter !== 'ALL')   filters.status   = statusFilter
      if (priorityFilter !== 'ALL') filters.priority = priorityFilter
      const res = await taskService.getTasks(filters)
      setTasks(res.data)
    } catch (err) {
      console.error('Failed to fetch tasks', err)
    } finally {
      setLoading(false)
    }
  }, [statusFilter, priorityFilter])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const setFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value === 'ALL') params.delete(key)
    else params.set(key, value)
    setSearchParams(params)
  }

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING'
    try {
      await taskService.updateTask(task.id, { ...task, status: newStatus })
      fetchTasks()
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await taskService.deleteTask(confirmModal.taskId)
      setConfirmModal({ open: false, taskId: null })
      fetchTasks()
    } catch (err) { console.error(err) }
    finally { setDeleteLoading(false) }
  }

  // Client-side search filter
  const displayedTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    (t.description || '').toLowerCase().includes(search.toLowerCase())
  )

  const FilterBtn = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200
                  ${active
                    ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                    : 'text-slate-500 border-slate-800 hover:text-slate-300 hover:border-slate-700 bg-slate-900/40'}`}
    >
      {children}
    </button>
  )

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-6 lg:p-8">

          {/* Page header */}
          <div className="flex items-center justify-between mb-6 animate-slide-up">
            <div>
              <h2 className="text-2xl font-bold text-white">All Tasks</h2>
              <p className="text-slate-400 text-sm mt-1">
                {loading ? '...' : `${displayedTasks.length} task${displayedTasks.length !== 1 ? 's' : ''} found`}
              </p>
            </div>
            <button
              onClick={() => setTaskModal({ open: true, task: null })}
              className="btn-primary flex items-center gap-2"
            >
              <span className="text-lg leading-none">+</span>
              New Task
            </button>
          </div>

          {/* Search + Filters */}
          <div className="glass-card p-4 mb-6 space-y-4 animate-slide-up">
            {/* Search bar */}
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
                   fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="input-field pl-10"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Filter chips */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-medium">Status:</span>
                <div className="flex gap-1.5">
                  {STATUSES.map(s => (
                    <FilterBtn key={s} active={statusFilter === s} onClick={() => setFilter('status', s)}>
                      {s === 'ALL' ? 'All' : s === 'PENDING' ? '⏳ Pending' : '✅ Completed'}
                    </FilterBtn>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 font-medium">Priority:</span>
                <div className="flex gap-1.5">
                  {PRIORITIES.map(p => (
                    <FilterBtn key={p} active={priorityFilter === p} onClick={() => setFilter('priority', p)}>
                      {p === 'ALL' ? 'All' : p === 'HIGH' ? '🔴 High' : p === 'MEDIUM' ? '🟡 Med' : '🟢 Low'}
                    </FilterBtn>
                  ))}
                </div>
              </div>

              {/* Clear all filters */}
              {(statusFilter !== 'ALL' || priorityFilter !== 'ALL' || search) && (
                <button
                  onClick={() => { setSearchParams({}); setSearch('') }}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors ml-auto"
                >
                  Clear all ✕
                </button>
              )}
            </div>
          </div>

          {/* Task list */}
          {loading ? (
            <div className="grid gap-3">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="glass-card p-5 h-24 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-slate-800 rounded mt-0.5" />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-800 rounded w-2/3 mb-2" />
                      <div className="h-3 bg-slate-800 rounded w-1/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayedTasks.length === 0 ? (
            <div className="glass-card p-14 text-center">
              <div className="text-5xl mb-4">
                {search ? '🔍' : statusFilter !== 'ALL' || priorityFilter !== 'ALL' ? '🎯' : '📋'}
              </div>
              <p className="text-slate-300 font-semibold">
                {search ? 'No tasks match your search' : 'No tasks here'}
              </p>
              <p className="text-slate-500 text-sm mt-1">
                {search
                  ? `Try a different search term`
                  : statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                    ? 'Try changing the filters above'
                    : 'Create your first task to get started'}
              </p>
              {!search && statusFilter === 'ALL' && priorityFilter === 'ALL' && (
                <button
                  onClick={() => setTaskModal({ open: true, task: null })}
                  className="btn-primary mt-5 inline-flex items-center gap-2"
                >
                  <span>+</span> Create Task
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-3">
              {displayedTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={(t) => setTaskModal({ open: true, task: t })}
                  onDelete={(id) => setConfirmModal({ open: true, taskId: id })}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <TaskModal
        isOpen={taskModal.open}
        task={taskModal.task}
        onClose={() => setTaskModal({ open: false, task: null })}
        onSave={fetchTasks}
      />
      <ConfirmModal
        isOpen={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, taskId: null })}
        onConfirm={handleDelete}
        loading={deleteLoading}
      />
    </div>
  )
}
