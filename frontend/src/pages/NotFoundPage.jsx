import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center animate-slide-up">
        <p className="text-8xl font-black text-slate-800 font-mono mb-2">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
