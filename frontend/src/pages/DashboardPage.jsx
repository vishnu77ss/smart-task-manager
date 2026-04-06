import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { taskService } from '../services/taskService'
import StatsCard from '../components/StatsCard'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import ConfirmModal from '../components/ConfirmModal'
import Sidebar from '../components/Sidebar'

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentTasks, setRecentTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [taskModal, setTaskModal] = useState({ open: false, task: null })
  const [confirmModal, setConfirmModal] = useState({ open: false, taskId: null })
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, tasksRes] = await Promise.all([
        taskService.getStats(),
        taskService.getTasks(),
      ])
      setStats(statsRes.data)
      // Show 6 most recent tasks on dashboard
      setRecentTasks(tasksRes.data.slice(0, 6))
    } catch (err) {
      console.error('Failed to load dashboard data', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING'
    try {
      await taskService.updateTask(task.id, { ...task, status: newStatus })
      fetchData()
    } catch (err) {
      console.error('Failed to update task status', err)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      await taskService.deleteTask(confirmModal.taskId)
      setConfirmModal({ open: false, taskId: null })
      fetchData()
    } catch (err) {
      console.error('Failed to delete task', err)
    } finally {
      setDeleteLoading(false)
    }
  }

  // Greeting based on time of day
  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-6 lg:p-8">

          {/* Header */}
          <div className="mb-8 animate-slide-up">
            <h2 className="text-2xl font-bold text-white">
              {getGreeting()}, {user?.name?.split(' ')[0]} 👋
            </h2>
            <p className="text-slate-400 mt-1 text-sm">
              Here's what's happening with your tasks today.
            </p>
          </div>

          {/* Stats Grid */}
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[1,2,3,4].map(i => (
                <div key={i} className="glass-card p-5 h-32 animate-pulse">
                  <div className="w-10 h-10 bg-slate-800 rounded-xl mb-4" />
                  <div className="h-6 bg-slate-800 rounded w-16 mb-2" />
                  <div className="h-4 bg-slate-800 rounded w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatsCard label="Total Tasks"     value={stats?.total}     icon="◫" color="indigo"  sublabel="All tasks" />
              <StatsCard label="Completed"        value={stats?.completed}  icon="◉" color="emerald" sublabel="Finished" />
              <StatsCard label="Pending"          value={stats?.pending}    icon="◷" color="amber"   sublabel="In progress" />
              <StatsCard label="Overdue"          value={stats?.overdue}    icon="⚠" color="red"     sublabel="Need attention" />
            </div>
          )}

          {/* Progress bar */}
          {stats && stats.total > 0 && (
            <div className="glass-card p-5 mb-8 animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-300">Overall Progress</span>
                <span className="text-sm font-mono text-indigo-400">
                  {Math.round((stats.completed / stats.total) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${Math.round((stats.completed / stats.total) * 100)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {stats.completed} of {stats.total} tasks completed
              </p>
            </div>
          )}

          {/* Recent Tasks */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white">Recent Tasks</h3>
            <div className="flex items-center gap-3">
              <Link to="/tasks" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                View all →
              </Link>
              <button
                onClick={() => setTaskModal({ open: true, task: null })}
                className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
              >
                <span>+</span> New Task
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid gap-3">
              {[1,2,3].map(i => (
                <div key={i} className="glass-card p-5 h-24 animate-pulse">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 bg-slate-800 rounded" />
                    <div className="flex-1">
                      <div className="h-4 bg-slate-800 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-slate-800 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentTasks.length === 0 ? (
            <div className="glass-card p-12 text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-slate-400 font-medium">No tasks yet</p>
              <p className="text-slate-600 text-sm mt-1">Create your first task to get started</p>
              <button
                onClick={() => setTaskModal({ open: true, task: null })}
                className="btn-primary mt-4 inline-flex items-center gap-2"
              >
                <span>+</span> Create Task
              </button>
            </div>
          ) : (
            <div className="grid gap-3">
              {recentTasks.map(task => (
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
        onSave={fetchData}
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
