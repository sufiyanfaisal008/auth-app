import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock } from 'lucide-react';
import api, { errMsg } from '../api.js';
import Field from '../components/Field.jsx';
import { AuthCard, Alert, SubmitButton } from '../components/AuthCard.jsx';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const strength = (() => {
    const p = form.password;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
    if (/\d/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();
  const bar = ['bg-slate-300 dark:bg-slate-700', 'bg-red-500', 'bg-amber-500', 'bg-lime-500', 'bg-emerald-500'][strength];
  const label = ['', 'Weak', 'Okay', 'Good', 'Strong'][strength];

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) return setError('Password must be at least 8 characters');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/signup', { name: form.name, email: form.email, password: form.password });
      sessionStorage.setItem('pendingEmail', data.email);
      navigate('/verify-email', { state: { email: data.email, fresh: true } });
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      icon={UserPlus}
      title="Create your account"
      subtitle="Get started in just a few seconds"
      footer={<>Already have an account? <Link to="/login" className="link">Login</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <Alert>{error}</Alert>
        <Field icon={User} label="Full name" placeholder="Ali Khan" value={form.name} onChange={set('name')} required autoComplete="name" />
        <Field icon={Mail} type="email" label="Email" placeholder="you@example.com" value={form.email} onChange={set('email')} required autoComplete="email" />
        <div>
          <Field icon={Lock} type="password" label="Password" placeholder="At least 8 characters" value={form.password} onChange={set('password')} required autoComplete="new-password" />
          {form.password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= strength ? bar : 'bg-slate-200 dark:bg-slate-700'}`} />
                ))}
              </div>
              <span className="w-12 text-right text-xs text-slate-500">{label}</span>
            </div>
          )}
        </div>
        <Field icon={Lock} type="password" label="Confirm password" placeholder="Re-enter your password" value={form.confirm} onChange={set('confirm')} required autoComplete="new-password" />
        <SubmitButton loading={loading} type="submit">Sign up</SubmitButton>
      </form>
    </AuthCard>
  );
}
