
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 获取游戏数据
router.get('/data/:address', async (req, res) => {
  try {
    const user = await User.findOne({ 
      walletAddress: req.params.address.toLowerCase() 
    });
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    res.json({
      user,
      gameConfig: {
        packages: [
          { id: 'free', name: '免费试玩', price: 0, lands: 1, buildings: 1 },
          { id: 'shrimp', name: '虾农', price: 0.05, lands: 6, buildings: 2 },
          { id: 'boss', name: '虾场主', price: 0.1, lands: 9, buildings: 3 },
          { id: 'king', name: '虾王', price: 0.5, lands: 16, buildings: 5 }
        ],
        buildings: [
          { id: 1, name: '水果店', output: 1, price: 1000 },
          { id: 2, name: '币安大厦', output: 2, price: 2000 },
          { id: 3, name: '龙虾餐厅', output: 3, price: 3000 },
          { id: 4, name: '钻石矿场', output: 5, price: 5000 },
          { id: 5, name: '虾王城堡', output: 10, price: 10000 }
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 签到
router.post('/signin', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    
    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase() 
    });
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    const now = new Date();
    const lastSign = user.lastSignTime || new Date(0);
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (now - lastSign < oneDay) {
      return res.status(400).json({ message: '今日已签到' });
    }
    
    if (now - lastSign > 2 * oneDay) {
      user.signStreak = 1;
    } else {
      user.signStreak += 1;
    }
    
    user.lastSignTime = now;
    await user.save();
    
    const reward = Math.min(10 * user.signStreak, 100);
    
    res.json({ 
      success: true, 
      reward,
      signStreak: user.signStreak 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 购买套餐
router.post('/purchase-package', async (req, res) => {
  try {
    const { walletAddress, packageType } = req.body;
    
    const user = await User.findOne({ 
      walletAddress: walletAddress.toLowerCase() 
    });
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    if (user.isV1) {
      return res.status(400).json({ message: '已购买过套餐' });
    }
    
    user.packageType = packageType;
    user.isV1 = true;
    
    await user.save();
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
