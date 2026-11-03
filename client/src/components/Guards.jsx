import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Spinner = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Loader2 className="animate-spin text-brand-500" size={32} />
  </div>
);

export function Protected({ children }) {
  const { user, loading } = useAuth();
  const loc = useLocation();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" state={{ from: loc.pathname }} replace />;
}

export function GuestOnly({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? <Navigate to="/dashboard" replace /> : children;
}
