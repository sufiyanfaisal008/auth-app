import { motion } from 'framer-motion';
import { BadgeCheck, Mail, CalendarDays, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const joined = new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

  const cards = [
    { icon: Mail, label: 'Email', value: user.email },
    { icon: BadgeCheck, label: 'Status', value: user.isVerified ? 'Verified' : 'Not verified' },
    { icon: CalendarDays, label: 'Member since', value: joined },
  ];

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="glass relative overflow-hidden rounded-3xl p-8 sm:p-10">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="relative flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 text-3xl font-extrabold text-white shadow-lg shadow-brand-500/30">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400"><Sparkles size={16} /> Welcome back</p>
            <h1 className="text-3xl font-extrabold tracking-tight">{user.name}</h1>
            <p className="mt-1 text-slate-500 dark:text-slate-400">You are logged in successfully.</p>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map(({ icon: Icon, label, value }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            whileHover={{ y: -4 }}
            className="glass rounded-2xl p-5"
          >
            <Icon size={20} className="mb-3 text-brand-500" />
            <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 break-words font-semibold">{value}</p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
