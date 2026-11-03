import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Field({ icon: Icon, type = 'text', label, ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <label className="block">
      {label && <span className="mb-1.5 block text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>}
      <span className="relative block">
        {Icon && (
          <Icon
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
        )}
        <input {...props} type={isPassword && show ? 'text' : type} className="input" />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-700"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </span>
    </label>
  );
}
