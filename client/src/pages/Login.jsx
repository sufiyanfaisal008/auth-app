import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Field from '../components/Field.jsx';
import { AuthCard, Alert, SubmitButton } from '../components/AuthCard.jsx';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', form);
      setUser(data.user);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (err) {
      if (err.response?.data?.needsVerification) {
        sessionStorage.setItem('pendingEmail', err.response.data.email);
        navigate('/verify-email', { state: { email: err.response.data.email } });
        return;
      }
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      icon={LogIn}
      title="Welcome back"
      subtitle="Log in to your account"
      footer={<>Don't have an account? <Link to="/signup" className="link">Sign up</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>
        <Field icon={Mail} type="email" label="Email" placeholder="you@example.com" value={form.email} onChange={set('email')} required autoComplete="email" />
        <div>
          <Field icon={Lock} type="password" label="Password" placeholder="Your password" value={form.password} onChange={set('password')} required autoComplete="current-password" />
          <div className="mt-2 text-right">
            <Link to="/forgot-password" className="link text-xs">Forgot password?</Link>
          </div>
        </div>
        <SubmitButton loading={loading} type="submit">Login</SubmitButton>
      </form>
    </AuthCard>
  );
}
