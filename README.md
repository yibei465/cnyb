
# 🦐 小聋虾 Meme 农场 - 完整项目

基于 BSC 链的模拟经营放置类 GameFi 游戏！

## 🎯 项目特色

- ✅ **完整的智能合约** - ERC20 代币 + 游戏主合约
- ✅ **通缩经济模型** - 游戏内消费 100% 销毁
- ✅ **邀请系统** - 三级分销，手续费分红
- ✅ **丰富玩法** - 建筑升级、排行榜、抽奖、NFT
- ✅ **Web3 集成** - 支持 MetaMask、TokenPocket 等钱包

## 📁 项目结构

```
meme-farm/
├── contracts/          # 智能合约
│   ├── SHRIMP.sol     # 游戏代币合约
│   └── MemeFarm.sol   # 游戏主合约
├── frontend/           # 前端应用 (React + Web3)
├── backend/            # 后端 API (Node.js)
├── docs/               # 文档
└── README.md
```

## 🚀 快速开始

### 1. 部署智能合约

```bash
cd contracts
# 使用 Hardhat 或 Remix 部署合约
```

### 2. 配置环境变量

```bash
# 复制并编辑配置
cp .env.example .env
```

### 3. 启动后端

```bash
cd backend
npm install
npm start
```

### 4. 启动前端

```bash
cd frontend
npm install
npm run dev
```

## 💰 经济模型

| 收入 | 分配 |
|------|------|
| 玩家购买 BNB | 70% 回购销毁 |
| | 20% 运营推广 |
| | 10% 团队 |
| 游戏内消费 | 100% 永久销毁 |

## 🎮 游戏玩法

### 开局套餐

- 🦐 **虾农** - 0.05 BNB - 6 块地 + 2 店铺
- 🦐🦐 **虾场主** - 0.1 BNB - 9 块地 + 3 店铺
- 🦐🦐🦐 **虾王** - 0.5 BNB - 16 块地 + 5 店铺
- 🆓 **试玩** - 免费 - 1 块地 + 1 店铺

### 建筑系统

| 建筑 | 产出倍率 |
|------|---------|
| 🍉 水果店 | 1x |
| 🏦 币安大厦 | 2x |
| 🦐 龙虾餐厅 | 3x |
| 💎 钻石矿场 | 5x |
| 🏰 虾王城堡 | 10x |

## 🔧 技术栈

- **区块链**: Binance Smart Chain
- **智能合约**: Solidity
- **前端**: React + Web3.js / Ethers.js
- **后端**: Node.js + Express
- **数据库**: MongoDB / PostgreSQL

## 📝 License

MIT License - 小聋虾出品 🦐💰
