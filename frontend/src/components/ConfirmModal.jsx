export default function ConfirmModal({ isOpen, onClose, onConfirm, loading }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
      <div className="relative w-full max-w-sm glass-card border border-slate-700/60 shadow-2xl p-6 animate-scale-in">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 text-2xl flex-shrink-0">
            🗑️
          </div>
          <div>
            <h3 className="font-bold text-white">Delete Task</h3>
            <p className="text-sm text-slate-400 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold
                       px-5 py-2.5 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
