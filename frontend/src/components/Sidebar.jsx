import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
       ${isActive
         ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
         : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
       }`
    }
  >
    <span className="text-lg">{icon}</span>
    <span>{label}</span>
  </NavLink>
)

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // User initials for avatar
  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <aside className="w-64 flex-shrink-0 h-screen sticky top-0 flex flex-col p-4 border-r border-slate-800/60">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 py-3 mb-8">
        <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <span className="text-white text-lg">✦</span>
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-none">TaskFlow</h1>
          <p className="text-xs text-slate-500 mt-0.5">Smart Manager</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 mb-2">Menu</p>
        <NavItem to="/dashboard" icon="⊞" label="Dashboard" />
        <NavItem to="/tasks" icon="◫" label="All Tasks" />

        <div className="mt-6">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 mb-2">Filter by Status</p>
          <NavItem to="/tasks?status=PENDING" icon="◷" label="Pending" />
          <NavItem to="/tasks?status=COMPLETED" icon="◉" label="Completed" />
        </div>

        <div className="mt-6">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 mb-2">Priority</p>
          <NavItem to="/tasks?priority=HIGH" icon="▲" label="High Priority" />
          <NavItem to="/tasks?priority=MEDIUM" icon="◆" label="Medium Priority" />
          <NavItem to="/tasks?priority=LOW" icon="▼" label="Low Priority" />
        </div>
      </nav>

      {/* User profile + logout */}
      <div className="border-t border-slate-800 pt-4">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-800/40 transition-colors">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full mt-2 flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-red-400
                     hover:bg-red-500/10 rounded-xl transition-all duration-200 font-medium"
        >
          <span>⎋</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
