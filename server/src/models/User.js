const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
    },
    password: { type: String, required: true, minlength: 8, select: false },
    isVerified: { type: Boolean, default: false },

    // OTP fields (hashed, kabhi plain save nahi hota)
    otpHash: { type: String, select: false },
    otpPurpose: { type: String, enum: ['verify', 'reset'], select: false },
    otpExpires: { type: Date, select: false },
    otpAttempts: { type: Number, default: 0, select: false },
    otpLastSent: { type: Date, select: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toSafe = function () {
  return { id: this._id, name: this.name, email: this.email, isVerified: this.isVerified, createdAt: this.createdAt };
};

module.exports = mongoose.model('User', userSchema);
