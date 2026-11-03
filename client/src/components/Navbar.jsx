import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/50 backdrop-blur-xl transition-colors duration-500 dark:border-slate-800/60 dark:bg-slate-950/40">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white shadow-lg shadow-brand-500/30">
            <ShieldCheck size={20} />
          </span>
          Auth<span className="text-brand-600 dark:text-brand-400">App</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <Link to="/dashboard" className="hidden text-sm font-semibold hover:text-brand-600 sm:block">
                Dashboard
              </Link>
              <button
                onClick={async () => { await logout(); navigate('/'); }}
                className="btn-ghost !px-3 !py-2"
              >
                <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-2 text-sm font-semibold transition hover:text-brand-600 dark:hover:text-brand-400">
                Login
              </Link>
              <Link to="/signup" className="btn-primary !w-auto !px-4 !py-2">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
