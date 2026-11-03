const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST) return null;
  const port = Number(process.env.SMTP_PORT) || 465;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
};

const template = (title, name, otp, note) => `
<div style="font-family:Arial,sans-serif;background:#f4f4f8;padding:32px">
  <div style="max-width:480px;margin:auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #e5e7eb">
    <h2 style="margin:0 0 8px;color:#111827">${title}</h2>
    <p style="color:#4b5563">Hi ${name},</p>
    <p style="color:#4b5563">${note}</p>
    <div style="font-size:36px;letter-spacing:10px;font-weight:700;text-align:center;margin:24px 0;color:#6366f1">${otp}</div>
    <p style="color:#6b7280;font-size:13px">This code is valid for 10 minutes. If you did not request it, you can safely ignore this email.</p>
  </div>
</div>`;

const sendOtpEmail = async ({ to, name, otp, purpose }) => {
  const isVerify = purpose === 'verify';
  const subject = isVerify ? 'Verify your email' : 'Password reset code';
  const html = template(
    isVerify ? 'Email Verification' : 'Password Reset',
    name,
    otp,
    isVerify ? 'Use this OTP to verify your account:' : 'Use this OTP to reset your password:'
  );

  const t = getTransporter();
  if (!t) {
    // Dev fallback: SMTP set nahi hai to console me print karo
    console.log(`\n[DEV MAIL] To: ${to} | ${subject} | OTP: ${otp}\n`);
    return;
  }
  await t.sendMail({ from: process.env.MAIL_FROM || process.env.SMTP_USER, to, subject, html });
};

module.exports = { sendOtpEmail };
