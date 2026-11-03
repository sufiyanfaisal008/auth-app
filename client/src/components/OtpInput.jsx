import { useRef } from 'react';

export default function OtpInput({ value, onChange, length = 6, disabled, shake }) {
  const refs = useRef([]);
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  const setAt = (i, d) => {
    const arr = digits.slice();
    arr[i] = d;
    onChange(arr.join(''));
  };

  const handleChange = (i, e) => {
    const d = e.target.value.replace(/\D/g, '').slice(-1);
    setAt(i, d);
    if (d && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handleKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
      setAt(i - 1, '');
    } else if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus();
    else if (e.key === 'ArrowRight' && i < length - 1) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!text) return;
    e.preventDefault();
    onChange(text);
    refs.current[Math.min(text.length, length - 1)]?.focus();
  };

  return (
    <div className={`flex justify-center gap-2 sm:gap-3 ${shake ? 'animate-shake' : ''}`}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={d}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          className={`h-12 w-10 rounded-xl border-2 bg-white/80 text-center text-xl font-bold outline-none transition-all duration-200 sm:h-14 sm:w-12
            focus:-translate-y-0.5 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15 dark:bg-slate-800/70
            ${d ? 'border-brand-400 dark:border-brand-500' : 'border-slate-200 dark:border-slate-700'}`}
        />
      ))}
    </div>
  );
}
