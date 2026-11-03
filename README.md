# AuthApp — MERN Authentication (Email OTP)

Express + MongoDB (Mongoose) backend, React + Vite + Tailwind frontend.

## Features
- Signup → email par 6-digit OTP → email verify → auto login
- Login (email + password), show/hide password
- Forgot password → email par OTP → naya password set
- Dark / Light theme (smooth animation, choice save hoti hai)
- Home page + "Get Started", protected Dashboard
- Security: bcrypt, OTP hashed, 10 min expiry, 5 attempts limit, 30s resend cooldown,
  httpOnly JWT cookie, helmet, rate limiting

## Setup

### 1. Backend
```bash
cd server
npm install
cp .env.example .env     # Windows: copy .env.example .env
```
`.env` me `MONGODB_URI` aur `JWT_SECRET` zaroor dalein. OTP email ke liye SMTP (Gmail App Password) dalein.
Agar `SMTP_HOST` khali choro to OTP server ke terminal me print hoga (sirf testing ke liye).

```bash
npm run dev      # http://localhost:5000
```

### 2. Frontend
```bash
cd client
npm install
npm run dev      # http://localhost:5173
```
Vite `/api` requests ko automatically `localhost:5000` par proxy karta hai.

## Gmail App Password
Google Account → Security → 2-Step Verification ON → App passwords → naya password banayein → `SMTP_PASS` me dalein.

## API
| Method | Route | Body |
|---|---|---|
| POST | /api/auth/signup | name, email, password |
| POST | /api/auth/verify-email | email, otp |
| POST | /api/auth/resend-otp | email, purpose (`verify`/`reset`) |
| POST | /api/auth/login | email, password |
| POST | /api/auth/logout | — |
| GET | /api/auth/me | — |
| POST | /api/auth/forgot-password | email |
| POST | /api/auth/reset-password | email, otp, newPassword |

## Production
- Frontend: `npm run build` (dist folder deploy karein)
- Server `.env`: `NODE_ENV=production`, `CLIENT_URL=https://your-frontend`
- Alag domains par deploy ho to cookie `sameSite: 'none'` + HTTPS chahiye hogi.
