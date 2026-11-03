import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import OtpInput from '../components/OtpInput.jsx';
import useCountdown from '../components/useCountdown.js';
import { AuthCard, Alert, SubmitButton } from '../components/AuthCard.jsx';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuth();
  const email = location.state?.email || sessionStorage.getItem('pendingEmail') || '';
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [left, resetTimer] = useCountdown(30);

  useEffect(() => {
    if (!email) navigate('/signup', { replace: true });
  }, [email, navigate]);

  const verify = async (code = otp) => {
    if (code.length !== 6) return setError('Please enter the 6-digit OTP');
    setError('');
    setInfo('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/verify-email', { email, otp: code });
      sessionStorage.removeItem('pendingEmail');
      setUser(data.user);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(errMsg(err));
      setShake(true);
      setTimeout(() => setShake(false), 450);
    } finally {
      setLoading(false);
    }
  };

  const onChange = (v) => {
    setOtp(v);
    if (v.length === 6) verify(v);
  };

  const resend = async () => {
    setError('');
    setInfo('');
    try {
      await api.post('/auth/resend-otp', { email, purpose: 'verify' });
      setInfo('A new OTP has been sent');
      setOtp('');
      resetTimer(30);
    } catch (err) {
      setError(errMsg(err));
    }
  };

  return (
    <AuthCard
      icon={MailCheck}
      title="Verify your email"
      subtitle={<>We sent a 6-digit code to <b className="text-slate-700 dark:text-slate-200">{email}</b></>}
      footer={<>Wrong email? <Link to="/signup" className="link">Sign up again</Link></>}
    >
      <form onSubmit={(e) => { e.preventDefault(); verify(); }} className="space-y-5">
        <Alert>{error}</Alert>
        <Alert type="success">{info}</Alert>
        <OtpInput value={otp} onChange={onChange} disabled={loading} shake={shake} />
        <SubmitButton loading={loading} type="submit">Verify email</SubmitButton>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Didn't get the code?{' '}
          {left > 0 ? (
            <span>Resend in {left}s</span>
          ) : (
            <button type="button" onClick={resend} className="link">Resend OTP</button>
          )}
        </p>
      </form>
    </AuthCard>
  );
}
