
# 🚀 小聋虾 Meme 农场 - 部署和测试指南

## 📋 前置要求

- Node.js 18+
- MongoDB
- MetaMask 钱包
- BSC 测试网 BNB（用于测试）

## 🔧 第一步：安装依赖

```bash
# 根目录安装 Hardhat 依赖
cd meme-farm
npm install

# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd ../frontend
npm install
```

## 📝 第二步：配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入你的配置
PRIVATE_KEY=your_private_key_here
BSCSCAN_API_KEY=your_bscscan_api_key_here
MONGODB_URI=mongodb://localhost:27017/meme-farm
JWT_SECRET=your_jwt_secret_key_here
```

## 🌐 第三步：部署智能合约（BSC 测试网）

### 获取测试网 BNB

1. 访问 https://testnet.bnbchain.org/faucet-smart
2. 输入你的钱包地址
3. 领取测试网 BNB

### 部署合约

```bash
cd meme-farm

# 部署到 BSC 测试网
npx hardhat run scripts/deploy.js --network bscTestnet

# 部署成功后，会生成 deployment.json 文件
```

### 验证合约（可选）

```bash
npx hardhat verify --network bscTestnet <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## 🗄️ 第四步：启动 MongoDB

```bash
# 方法 1：本地 MongoDB
sudo systemctl start mongod

# 方法 2：Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🚀 第五步：启动后端

```bash
cd meme-farm/backend
npm start
# 或开发模式
npm run dev
```

后端将运行在 http://localhost:3000

## 🎨 第六步：启动前端

```bash
cd meme-farm/frontend

# 编辑前端配置，填入合约地址
echo "VITE_CONTRACT_ADDRESS=YOUR_DEPLOYED_CONTRACT_ADDRESS" > .env
echo "VITE_RPC_URL=https://data-seed-prebsc-1-s1.binance.org:8545" >> .env

# 启动前端
npm run dev
```

前端将运行在 http://localhost:5173

## 🧪 第七步：测试游戏

### 1. 连接钱包

- 打开 http://localhost:5173
- 点击"连接 MetaMask 钱包"
- 确认连接

### 2. 注册用户

- 首次连接会自动注册
- 可以输入邀请码（可选）

### 3. 购买套餐

- 选择套餐（免费、虾农、虾场主、虾王）
- 确认交易
- 开始游戏！

### 4. 每日签到

- 点击"每日签到"
- 获得 SHRIMP 奖励

### 5. 邀请好友

- 复制你的邀请码
- 分享给朋友
- 获得 10% 手续费分红

## 📊 第八步：部署到主网

### 部署到 BSC 主网

```bash
cd meme-farm
npx hardhat run scripts/deploy.js --network bscMainnet
```

### 配置生产环境

```bash
# 更新 .env
VITE_RPC_URL=https://bsc-dataseed.binance.org
```

### 部署前端

```bash
cd frontend
npm run build
# 将 dist/ 目录部署到 Vercel、Netlify 或你的服务器
```

### 部署后端

```bash
# 使用 PM2 或 Docker 部署后端
cd backend
npm install -g pm2
pm2 start server.js --name meme-farm-backend
```

## 🎯 游戏玩法测试清单

- [ ] 钱包连接正常
- [ ] 用户注册成功
- [ ] 购买套餐功能
- [ ] 每日签到功能
- [ ] 邀请系统正常
- [ ] 排行榜显示
- [ ] 建筑购买功能
- [ ] 收益领取功能
- [ ] 智能合约交互正常
- [ ] 代币转账正常

## 🐛 常见问题

### Q: 合约部署失败？
A: 检查钱包是否有足够的 BNB，RPC 节点是否正常

### Q: 后端连接不上 MongoDB？
A: 确认 MongoDB 服务已启动，检查连接字符串

### Q: 前端无法连接钱包？
A: 确认安装了 MetaMask，网络设置为 BSC 测试网

### Q: 交易无法确认？
A: 检查 Gas 价格，确认钱包有足够 BNB

## 📞 需要帮助？

查看文档或联系开发者！

---

**祝你部署顺利！🦐💰**
