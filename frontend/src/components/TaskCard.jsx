import { formatDate, isOverdue, getDueDateLabel } from '../utils/helpers'

const PriorityBadge = ({ priority }) => {
  const map = {
    HIGH:   { cls: 'badge-high',   dot: 'bg-red-400',    label: 'High' },
    MEDIUM: { cls: 'badge-medium', dot: 'bg-amber-400',  label: 'Medium' },
    LOW:    { cls: 'badge-low',    dot: 'bg-emerald-400',label: 'Low' },
  }
  const { cls, dot, label } = map[priority] || map.MEDIUM
  return (
    <span className={cls}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}

const StatusBadge = ({ status }) => (
  <span className={status === 'COMPLETED' ? 'badge-completed' : 'badge-pending'}>
    <span className={`w-1.5 h-1.5 rounded-full ${status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-indigo-400'}`} />
    {status === 'COMPLETED' ? 'Completed' : 'Pending'}
  </span>
)

export default function TaskCard({ task, onEdit, onDelete, onToggleStatus }) {
  const overdue = isOverdue(task.dueDate, task.status)
  const dueDateLabel = getDueDateLabel(task.dueDate, task.status)

  return (
    <div className={`glass-card p-5 animate-slide-up group hover:border-slate-600/60 transition-all duration-300
                     ${task.status === 'COMPLETED' ? 'opacity-75' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          {/* Checkbox */}
          <button
            onClick={() => onToggleStatus(task)}
            className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center
                        transition-all duration-200
                        ${task.status === 'COMPLETED'
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'border-slate-600 hover:border-indigo-400'}`}
            title={task.status === 'COMPLETED' ? 'Mark as pending' : 'Mark as completed'}
          >
            {task.status === 'COMPLETED' && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <h3 className={`font-semibold text-sm leading-snug flex-1
                          ${task.status === 'COMPLETED' ? 'line-through text-slate-500' : 'text-slate-100'}`}>
            {task.title}
          </h3>
        </div>

        {/* Actions — visible on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all"
            title="Edit task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
            title="Delete task"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 mb-3 ml-8 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 ml-8">
        <div className="flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={task.priority} />
          <StatusBadge status={task.status} />
        </div>

        {/* Due date */}
        {task.dueDate && (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border
                            ${overdue
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : dueDateLabel === 'Due today'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-slate-800 text-slate-500 border-slate-700'
                            }`}>
            {dueDateLabel || formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  )
}
