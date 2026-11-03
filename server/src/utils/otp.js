const crypto = require('crypto');

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESEND_COOLDOWN_MS = 30 * 1000; // 30 seconds
const MAX_ATTEMPTS = 5;

const generateOtp = () => String(crypto.randomInt(0, 1000000)).padStart(6, '0');

const hashOtp = (otp) =>
  crypto.createHmac('sha256', process.env.JWT_SECRET).update(String(otp)).digest('hex');

const safeEqual = (a, b) => {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb);
};

module.exports = { generateOtp, hashOtp, safeEqual, OTP_TTL_MS, RESEND_COOLDOWN_MS, MAX_ATTEMPTS };
