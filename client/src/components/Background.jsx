export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-slate-50 to-fuchsia-50 transition-colors duration-500 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900" />
      <div className="absolute -left-24 -top-24 h-96 w-96 animate-float rounded-full bg-brand-400/30 blur-3xl dark:bg-brand-600/25" />
      <div className="absolute -right-24 top-1/3 h-96 w-96 animate-float-slow rounded-full bg-fuchsia-400/25 blur-3xl dark:bg-fuchsia-600/20" />
      <div className="absolute -bottom-32 left-1/3 h-96 w-96 animate-float rounded-full bg-violet-400/25 blur-3xl dark:bg-violet-600/20" />
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99,102,241,.25) 1px, transparent 0)',
          backgroundSize: '28px 28px',
        }}
      />
    </div>
  );
}
