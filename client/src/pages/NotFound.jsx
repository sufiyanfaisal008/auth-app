import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="bg-gradient-to-r from-brand-500 to-fuchsia-500 bg-clip-text text-8xl font-extrabold text-transparent">404</h1>
      <p className="mt-3 text-slate-500 dark:text-slate-400">This page does not exist.</p>
      <Link to="/" className="btn-primary mt-6 !w-auto !px-8">Go home</Link>
    </main>
  );
}
