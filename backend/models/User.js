
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  username: {
    type: String,
    default: 'Shrimp Farmer'
  },
  referralCode: {
    type: String,
    unique: true
  },
  referrer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  referralCount: {
    type: Number,
    default: 0
  },
  totalEarned: {
    type: Number,
    default: 0
  },
  lastSignTime: {
    type: Date
  },
  signStreak: {
    type: Number,
    default: 0
  },
  isV1: {
    type: Boolean,
    default: false
  },
  packageType: {
    type: String,
    enum: ['free', 'shrimp', 'boss', 'king'],
    default: 'free'
  }
}, {
  timestamps: true
});

// 生成邀请码
userSchema.pre('save', function(next) {
  if (!this.referralCode) {
    this.referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('User', userSchema);
