require('dotenv').config();
const mongoose = require('mongoose');

for (const key of ['MONGODB_URI', 'JWT_SECRET']) {
  if (!process.env[key]) {
    console.error(`❌ .env me ${key} missing hai. .env.example copy karke .env banayein.`);
    process.exit(1);
  }
}

const app = require('./app');
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
