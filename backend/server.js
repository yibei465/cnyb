
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 数据文件路径
const DATA_FILE = path.join(__dirname, 'data.json');

// 初始化数据文件
function initData() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      users: [],
      nextId: 1
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// 读取数据
function readData() {
  initData();
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// 写入数据
function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// 测试路由
app.get('/', (req, res) => {
  res.json({ 
    message: '🦐 小聋虾 Meme 农场 API',
    version: '1.0.0',
    status: 'running'
  });
});

// 获取用户信息
app.get('/api/users/:address', (req, res) => {
  try {
    const data = readData();
    const user = data.users.find(u => 
      u.walletAddress.toLowerCase() === req.params.address.toLowerCase()
    );
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 注册用户
app.post('/api/users/register', (req, res) => {
  try {
    const { walletAddress, referralCode } = req.body;
    const data = readData();
    
    // 检查是否已注册
    const existingUser = data.users.find(u => 
      u.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
    
    if (existingUser) {
      return res.status(400).json({ message: '该钱包已注册' });
    }
    
    // 查找邀请人
    let referrer = null;
    if (referralCode) {
      referrer = data.users.find(u => u.referralCode === referralCode);
    }
    
    // 创建新用户
    const newUser = {
      id: data.nextId++,
      walletAddress: walletAddress.toLowerCase(),
      username: 'Shrimp Farmer',
      referralCode: Math.random().toString(36).substring(2, 10).toUpperCase(),
      referrerId: referrer ? referrer.id : null,
      referralCount: 0,
      totalEarned: 0,
      lastSignTime: null,
      signStreak: 0,
      isV1: false,
      packageType: 'free',
      createdAt: new Date().toISOString()
    };
    
    // 更新邀请人
    if (referrer) {
      referrer.referralCount += 1;
    }
    
    data.users.push(newUser);
    writeData(data);
    
    res.status(201).json({ 
      user: newUser,
      token: 'mock-jwt-token-' + newUser.id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取排行榜
app.get('/api/users/leaderboard/:type', (req, res) => {
  try {
    const data = readData();
    const { type } = req.params;
    
    let sortedUsers = [...data.users.filter(u => u.isV1)];
    
    if (type === 'earnings') {
      sortedUsers.sort((a, b) => b.totalEarned - a.totalEarned);
    } else if (type === 'referrals') {
      sortedUsers.sort((a, b) => b.referralCount - a.referralCount);
    } else {
      sortedUsers.sort((a, b) => b.totalEarned - a.totalEarned);
    }
    
    res.json(sortedUsers.slice(0, 100));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 获取游戏数据
app.get('/api/game/data/:address', (req, res) => {
  try {
    const data = readData();
    const user = data.users.find(u => 
      u.walletAddress.toLowerCase() === req.params.address.toLowerCase()
    );
    
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
app.post('/api/game/signin', (req, res) => {
  try {
    const { walletAddress } = req.body;
    const data = readData();
    
    const user = data.users.find(u => 
      u.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    const now = new Date();
    const lastSign = user.lastSignTime ? new Date(user.lastSignTime) : new Date(0);
    const oneDay = 24 * 60 * 60 * 1000;
    
    if (now - lastSign < oneDay) {
      return res.status(400).json({ message: '今日已签到' });
    }
    
    if (now - lastSign > 2 * oneDay) {
      user.signStreak = 1;
    } else {
      user.signStreak += 1;
    }
    
    user.lastSignTime = now.toISOString();
    user.totalEarned += Math.min(10 * user.signStreak, 100);
    
    writeData(data);
    
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
app.post('/api/game/purchase-package', (req, res) => {
  try {
    const { walletAddress, packageType } = req.body;
    const data = readData();
    
    const user = data.users.find(u => 
      u.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    if (user.isV1) {
      return res.status(400).json({ message: '已购买过套餐' });
    }
    
    user.packageType = packageType;
    user.isV1 = true;
    
    writeData(data);
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 初始化数据
initData();

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 后端服务器运行在端口 ${PORT}`);
  console.log(`📊 数据文件: ${DATA_FILE}`);
  console.log(`🦐 小聋虾 Meme 农场 API 已就绪！`);
});
