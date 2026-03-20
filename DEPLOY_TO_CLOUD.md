
# 🚀 小聋虾 Meme 农场 - 云服务器部署指南

## 🎯 部署方案（完全免费！）

- **前端**: Vercel（免费）
- **后端**: Railway（免费）
- **数据库**: Railway MongoDB（免费）

---

## 📋 前置准备

1. **GitHub 账户** - https://github.com
2. **Vercel 账户** - https://vercel.com（用 GitHub 登录）
3. **Railway 账户** - https://railway.app（用 GitHub 登录）

---

## 🚀 第一步：推送到 GitHub

### 1. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 仓库名：`meme-farm`
3. 选择 Public 或 Private
4. 点击 "Create repository"

### 2. 初始化 Git 并推送

```bash
cd /root/.openclaw/workspace/meme-farm

# 初始化 Git
git init
git add .
git commit -m "Initial commit: Meme Farm game"

# 添加远程仓库
git remote add origin https://github.com/你的用户名/meme-farm.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

---

## 🎨 第二步：部署前端到 Vercel

### 1. 导入项目到 Vercel

1. 访问 https://vercel.com/new
2. 选择刚才的 `meme-farm` 仓库
3. 点击 "Import"

### 2. 配置项目

**项目设置：**
- Framework Preset: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

**环境变量：**
```
VITE_API_URL=https://你的后端地址.railway.app
```

### 3. 点击 "Deploy"

等待 1-2 分钟，部署完成！

---

## 🔧 第三步：部署后端到 Railway

### 1. 创建新项目

1. 访问 https://railway.app/new
2. 选择 "Deploy from GitHub repo"
3. 选择 `meme-farm` 仓库

### 2. 添加数据库

1. 在 Railway 项目中，点击 "+ New"
2. 选择 "Database" → "MongoDB"
3. 等待数据库启动

### 3. 配置后端

**Root Directory:** `backend`

**环境变量：**
```
PORT=3000
MONGODB_URI=${{MongoDB.MONGO_URL}}
JWT_SECRET=your-super-secret-key-change-this
```

### 4. 点击 "Deploy"

等待 2-3 分钟，部署完成！

---

## 🔗 第四步：连接前后端

### 1. 获取后端地址

在 Railway 项目中，找到后端服务的 URL，类似：
`https://meme-farm-backend-production.up.railway.app`

### 2. 更新前端环境变量

在 Vercel 项目设置中：
```
VITE_API_URL=https://meme-farm-backend-production.up.railway.app
```

### 3. 重新部署前端

在 Vercel 中点击 "Redeploy"

---

## 🎉 完成！

你的游戏现在已经上线了！

**访问地址：**
- 前端：`https://meme-farm-你的用户名.vercel.app`
- 后端：`https://meme-farm-backend-production.up.railway.app`

---

## 💰 成本说明

- **Vercel**: 免费（个人项目）
- **Railway**: 免费计划（$5/月额度，足够用）
- **GitHub**: 免费

完全免费！🆓

---

## 🛠️ 常见问题

### Q: 部署失败怎么办？
A: 检查日志，看看是什么错误，然后告诉我！

### Q: 如何更新代码？
A: 推送到 GitHub，Vercel 和 Railway 会自动重新部署！

### Q: 数据库数据会丢失吗？
A: Railway 的 MongoDB 是持久化的，不会丢失！

---

## 📞 需要帮助？

按照步骤操作，遇到问题随时告诉我！

---

**祝你部署顺利！** 🦐🚀
