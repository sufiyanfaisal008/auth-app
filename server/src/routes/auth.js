const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { sendOtpEmail } = require('../utils/mailer');
const { generateOtp, hashOtp, safeEqual, OTP_TTL_MS, RESEND_COOLDOWN_MS, MAX_ATTEMPTS } = require('../utils/otp');

const router = express.Router();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'test' ? 10000 : 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later' },
});
router.use(limiter);

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const norm = (e) => String(e || '').trim().toLowerCase();
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

const setCookie = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// OTP generate + save + email. Cooldown check ke saath.
const issueOtp = async (userId, purpose) => {
  const user = await User.findById(userId).select('+otpLastSent +otpHash +otpExpires +otpPurpose +otpAttempts');
  if (user.otpLastSent && Date.now() - user.otpLastSent.getTime() < RESEND_COOLDOWN_MS) {
    const wait = Math.ceil((RESEND_COOLDOWN_MS - (Date.now() - user.otpLastSent.getTime())) / 1000);
    const err = new Error(`Please wait ${wait} seconds before requesting a new OTP`);
    err.status = 429;
    throw err;
  }
  const otp = generateOtp();
  user.otpHash = hashOtp(otp);
  user.otpPurpose = purpose;
  user.otpExpires = new Date(Date.now() + OTP_TTL_MS);
  user.otpAttempts = 0;
  user.otpLastSent = new Date();
  await user.save();
  await sendOtpEmail({ to: user.email, name: user.name, otp, purpose });
};

// OTP check. Success par true, warna error throw.
const checkOtp = (user, otp, purpose) => {
  const bad = (msg, status = 400) => {
    const e = new Error(msg);
    e.status = status;
    return e;
  };
  if (!user.otpHash || user.otpPurpose !== purpose || !user.otpExpires) throw bad('Please request an OTP first');
  if (user.otpExpires.getTime() < Date.now()) throw bad('This OTP has expired. Please request a new one');
  if (user.otpAttempts >= MAX_ATTEMPTS) throw bad('Too many incorrect attempts. Please request a new OTP', 429);
  return safeEqual(hashOtp(String(otp || '').trim()), user.otpHash);
};

const clearOtp = (user) => {
  user.otpHash = undefined;
  user.otpPurpose = undefined;
  user.otpExpires = undefined;
  user.otpAttempts = 0;
  user.otpLastSent = undefined; // OTP use ho gaya to cooldown khatam
};

// ---------- SIGNUP ----------
router.post(
  '/signup',
  wrap(async (req, res) => {
    const name = String(req.body.name || '').trim();
    const email = norm(req.body.email);
    const password = String(req.body.password || '');

    if (name.length < 2) return res.status(400).json({ message: 'Name must be at least 2 characters' });
    if (!EMAIL_RE.test(email)) return res.status(400).json({ message: 'Please enter a valid email address' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });

    let user = await User.findOne({ email });
    if (user && user.isVerified) return res.status(409).json({ message: 'This email is already registered. Please log in' });

    if (user) {
      // Unverified account: naam/password update karke dobara OTP bhejo
      user.name = name;
      user.password = password;
      await user.save();
    } else {
      user = await User.create({ name, email, password });
    }
    await issueOtp(user._id, 'verify');
    res.status(201).json({ message: 'We sent a verification code to your email', email });
  })
);

// ---------- VERIFY EMAIL ----------
router.post(
  '/verify-email',
  wrap(async (req, res) => {
    const email = norm(req.body.email);
    const user = await User.findOne({ email }).select('+otpHash +otpPurpose +otpExpires +otpAttempts');
    if (!user) return res.status(400).json({ message: 'Account not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Email is already verified' });

    const ok = checkOtp(user, req.body.otp, 'verify');
    if (!ok) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: 'Incorrect OTP' });
    }
    user.isVerified = true;
    clearOtp(user);
    await user.save();
    setCookie(res, user);
    res.json({ message: 'Email verified successfully!', user: user.toSafe() });
  })
);

// ---------- RESEND OTP ----------
router.post(
  '/resend-otp',
  wrap(async (req, res) => {
    const email = norm(req.body.email);
    const purpose = req.body.purpose === 'reset' ? 'reset' : 'verify';
    const user = await User.findOne({ email });
    // Account na ho ya state match na kare to bhi generic response (enumeration se bachao)
    if (user && ((purpose === 'verify' && !user.isVerified) || (purpose === 'reset' && user.isVerified))) {
      await issueOtp(user._id, purpose);
    }
    res.json({ message: 'If the account exists, a new OTP has been sent' });
  })
);

// ---------- LOGIN ----------
router.post(
  '/login',
  wrap(async (req, res) => {
    const email = norm(req.body.email);
    const password = String(req.body.password || '');
    if (!EMAIL_RE.test(email) || !password) return res.status(400).json({ message: 'Please enter your email and password' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    if (!user.isVerified) {
      try {
        await issueOtp(user._id, 'verify');
      } catch (e) {
        if (e.status !== 429) throw e; // cooldown me hai to purana OTP chalega
      }
      return res.status(403).json({ message: 'Please verify your email first. We sent you a new OTP', needsVerification: true, email });
    }
    setCookie(res, user);
    res.json({ message: 'Logged in successfully', user: user.toSafe() });
  })
);

// ---------- LOGOUT ----------
router.post('/logout', (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.json({ message: 'Logged out' });
});

// ---------- ME ----------
router.get('/me', auth, (req, res) => res.json({ user: req.user.toSafe() }));

// ---------- FORGOT PASSWORD ----------
router.post(
  '/forgot-password',
  wrap(async (req, res) => {
    const email = norm(req.body.email);
    if (!EMAIL_RE.test(email)) return res.status(400).json({ message: 'Please enter a valid email address' });
    const user = await User.findOne({ email });
    if (user && user.isVerified) {
      try {
        await issueOtp(user._id, 'reset');
      } catch (e) {
        if (e.status !== 429) throw e;
        return res.status(429).json({ message: e.message });
      }
    }
    res.json({ message: 'If this email is registered, an OTP has been sent', email });
  })
);

// ---------- RESET PASSWORD ----------
router.post(
  '/reset-password',
  wrap(async (req, res) => {
    const email = norm(req.body.email);
    const newPassword = String(req.body.newPassword || '');
    if (newPassword.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });

    const user = await User.findOne({ email }).select('+otpHash +otpPurpose +otpExpires +otpAttempts');
    if (!user || !user.isVerified) return res.status(400).json({ message: 'The OTP is incorrect or has expired' });

    const ok = checkOtp(user, req.body.otp, 'reset');
    if (!ok) {
      user.otpAttempts += 1;
      await user.save();
      return res.status(400).json({ message: 'Incorrect OTP' });
    }
    user.password = newPassword;
    clearOtp(user);
    await user.save();
    res.json({ message: 'Password updated successfully. You can now log in' });
  })
);

module.exports = router;
