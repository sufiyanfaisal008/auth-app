import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export function AuthCard({ icon: Icon, title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="glass w-full max-w-md rounded-3xl p-6 sm:p-8"
      >
        <div className="mb-6 text-center">
          {Icon && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.15 }}
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white shadow-lg shadow-brand-500/30"
            >
              <Icon size={26} />
            </motion.div>
          )}
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        {children}
        {footer && <div className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">{footer}</div>}
      </motion.div>
    </div>
  );
}

export function Alert({ type = 'error', children }) {
  const isErr = type === 'error';
  return (
    <AnimatePresence>
      {children && (
        <motion.div
          key={String(children)}
          initial={{ opacity: 0, height: 0, y: -6 }}
          animate={{ opacity: 1, height: 'auto', y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
          role={isErr ? 'alert' : 'status'}
        >
          <div
            className={`mb-4 flex items-start gap-2 rounded-xl border px-3.5 py-2.5 text-sm ${
              isErr
                ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300'
            }`}
          >
            {isErr ? <AlertCircle size={18} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
            <span>{children}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function SubmitButton({ loading, children, ...props }) {
  return (
    <button className="btn-primary" disabled={loading} {...props}>
      {loading && <Loader2 size={18} className="animate-spin" />}
      {children}
    </button>
  );
}
