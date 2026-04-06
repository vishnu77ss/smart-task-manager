export default function StatsCard({ label, value, icon, color, sublabel }) {
  const colorMap = {
    indigo:   { bg: 'bg-indigo-500/10',  border: 'border-indigo-500/20',  icon: 'text-indigo-400',  val: 'text-indigo-300' },
    emerald:  { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400', val: 'text-emerald-300' },
    amber:    { bg: 'bg-amber-500/10',   border: 'border-amber-500/20',   icon: 'text-amber-400',   val: 'text-amber-300' },
    red:      { bg: 'bg-red-500/10',     border: 'border-red-500/20',     icon: 'text-red-400',     val: 'text-red-300' },
  }
  const c = colorMap[color] || colorMap.indigo

  return (
    <div className={`glass-card p-5 border ${c.border} animate-slide-up`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 ${c.bg} rounded-xl flex items-center justify-center text-xl ${c.icon}`}>
          {icon}
        </div>
      </div>
      <div className={`text-3xl font-bold ${c.val} mb-1 font-mono`}>
        {value ?? <span className="text-slate-600 text-2xl">—</span>}
      </div>
      <p className="text-sm text-slate-400 font-medium">{label}</p>
      {sublabel && <p className="text-xs text-slate-600 mt-1">{sublabel}</p>}
    </div>
  )
}
