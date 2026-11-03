import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MailCheck, KeyRound, Palette, Lock, Zap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const features = [
  { icon: MailCheck, title: 'Email OTP Verification', text: 'Verify your email with a 6-digit OTP right after signup.' },
  { icon: Lock, title: 'Secure by default', text: 'Bcrypt-hashed passwords, httpOnly cookies and rate limiting.' },
  { icon: KeyRound, title: 'Forgot password', text: 'Reset your password with an OTP in seconds.' },
  { icon: Palette, title: 'Dark & Light theme', text: 'A smooth, animated theme switch that remembers your choice.' },
  { icon: Zap, title: 'Blazing fast', text: 'React + Vite frontend, Express + MongoDB backend.' },
  { icon: ShieldCheck, title: 'Session safe', text: 'JWT cookie sessions that JavaScript cannot access.' },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Home() {
  const { user } = useAuth();
  return (
    <motion.main exit={{ opacity: 0 }} className="mx-auto max-w-6xl px-4">
      <section className="flex flex-col items-center py-20 text-center sm:py-28">
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50/80 px-4 py-1.5 text-xs font-semibold text-brand-700 backdrop-blur dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-300"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" /> Secure authentication, ready to use
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl"
        >
          Give your app a{' '}
          <span className="animate-gradient bg-gradient-to-r from-brand-500 via-fuchsia-500 to-violet-500 bg-[length:200%_200%] bg-clip-text text-transparent">
            secure login
          </span>{' '}
          experience
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-6 max-w-xl text-base text-slate-600 dark:text-slate-400 sm:text-lg"
        >
          Sign up, email OTP verification, login and password reset — all in one beautiful, smooth and secure full-stack app.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6 }}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Link to={user ? '/dashboard' : '/signup'} className="btn-primary group !w-auto !px-8 !py-3.5 !text-base">
            {user ? 'Go to Dashboard' : 'Get Started'}
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          {!user && (
            <Link to="/login" className="btn-ghost !px-8 !py-3.5 !text-base">
              Login
            </Link>
          )}
        </motion.div>
      </section>

      <motion.section
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="grid gap-5 pb-24 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map(({ icon: Icon, title, text }) => (
          <motion.div
            key={title}
            variants={item}
            whileHover={{ y: -6 }}
            className="glass group rounded-2xl p-6"
          >
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white dark:text-brand-300">
              <Icon size={22} />
            </div>
            <h3 className="font-bold">{title}</h3>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{text}</p>
          </motion.div>
        ))}
      </motion.section>

      <footer className="pb-8 text-center text-xs text-slate-400">© {new Date().getFullYear()} AuthApp. Built with MERN.</footer>
    </motion.main>
  );
}
