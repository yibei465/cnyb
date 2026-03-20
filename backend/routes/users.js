
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 获取用户信息
router.get('/:address', async (req, res) => {
  try {
    const user = await User.findOne({ 
      walletAddress: req.params.address.toLowerCase() 
    }).populate('referrer');
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 注册用户
router.post('/register', async (req, res) => {
  try {
    const { walletAddress, referralCode } = req.body;
    
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ referralCode });
    }
    
    const user = new User({
      walletAddress,
      referrer: referrer ? referrer._id : null
    });
    
    await user.save();
    
    if (referrer) {
      referrer.referralCount += 1;
      await referrer.save();
    }
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '30d' }
    );
    
    res.status(201).json({ user, token });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: '该钱包已注册' });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// 获取排行榜
router.get('/leaderboard/:type', async (req, res) => {
  try {
    const { type } = req.params;
    let sort = {};
    
    switch (type) {
      case 'earnings':
        sort = { totalEarned: -1 };
        break;
      case 'referrals':
        sort = { referralCount: -1 };
        break;
      default:
        sort = { totalEarned: -1 };
    }
    
    const users = await User.find({ isV1: true })
      .sort(sort)
      .limit(100);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
