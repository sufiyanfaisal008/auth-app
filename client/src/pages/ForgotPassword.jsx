import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, Mail, Lock, ArrowLeft } from 'lucide-react';
import api, { errMsg } from '../api.js';
import Field from '../components/Field.jsx';
import OtpInput from '../components/OtpInput.jsx';
import useCountdown from '../components/useCountdown.js';
import { AuthCard, Alert, SubmitButton } from '../components/AuthCard.jsx';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [left, resetTimer] = useCountdown(30);

  const sendOtp = async (e) => {
    e?.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setStep(2);
      setInfo('If this email is registered, an OTP has been sent');
      resetTimer(30);
    } catch (err) {
      setError(errMsg(err));
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    setError('');
    setInfo('');
    try {
      await api.post('/auth/forgot-password', { email });
      setInfo('A new OTP has been sent');
      setOtp('');
      resetTimer(30);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    if (otp.length !== 6) return setError('Please enter the 6-digit OTP');
    if (password.length < 8) return setError('Password must be at least 8 characters');
    if (password !== confirm) return setError('Passwords do not match');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword: password });
      setStep(3);
      setTimeout(() => navigate('/login', { replace: true }), 2500);
    } catch (err) {
      setError(errMsg(err));
      setShake(true);
      setTimeout(() => setShake(false), 450);
    } finally {
      setLoading(false);
    }
  };

  const slide = { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -30 }, transition: { duration: 0.25 } };

  return (
    <AuthCard
      icon={KeyRound}
      title={step === 3 ? 'Password updated!' : 'Password reset'}
      subtitle={
        step === 1 ? "Enter your email and we'll send you an OTP"
          : step === 2 ? <>We sent an OTP to <b className="text-slate-700 dark:text-slate-200">{email}</b></>
          : 'You can now log in with your new password'
      }
      footer={<Link to="/login" className="link inline-flex items-center gap-1"><ArrowLeft size={14} /> Back to login</Link>}
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.form key="s1" {...slide} onSubmit={sendOtp} className="space-y-4">
            <Alert>{error}</Alert>
            <Field icon={Mail} type="email" label="Email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            <SubmitButton loading={loading} type="submit">Send OTP</SubmitButton>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form key="s2" {...slide} onSubmit={reset} className="space-y-4">
            <Alert>{error}</Alert>
            <Alert type="success">{info}</Alert>
            <OtpInput value={otp} onChange={setOtp} disabled={loading} shake={shake} />
            <Field icon={Lock} type="password" label="New password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
            <Field icon={Lock} type="password" label="Confirm new password" placeholder="Re-enter your password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required autoComplete="new-password" />
            <SubmitButton loading={loading} type="submit">Update password</SubmitButton>
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Didn't get the OTP?{' '}
              {left > 0 ? <span>Resend in {left}s</span> : <button type="button" onClick={resend} className="link">Resend OTP</button>}
            </p>
          </motion.form>
        )}

        {step === 3 && (
          <motion.div key="s3" {...slide} className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 14 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500"
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <motion.path d="M5 13l4 4L19 7" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.5 }} />
              </svg>
            </motion.div>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Redirecting to login…</p>
            <Link to="/login" className="btn-primary">Login now</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthCard>
  );
}
