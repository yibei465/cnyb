
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

function App() {
  const [wallet, setWallet] = useState(null);
  const [user, setUser] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:3000/api';

  // 连接钱包
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('请安装 MetaMask 钱包！');
        return;
      }

      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const address = accounts[0];

      setWallet({ address, provider });
      
      // 检查用户是否已注册
      await checkOrRegisterUser(address);
    } catch (error) {
      console.error('连接钱包失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 检查或注册用户
  const checkOrRegisterUser = async (address) => {
    try {
      const res = await axios.get(`${API_BASE}/users/${address}`);
      setUser(res.data);
      await loadGameData(address);
    } catch (error) {
      if (error.response?.status === 404) {
        // 用户不存在，注册新用户
        const referralCode = prompt('输入邀请码（可选）：');
        const res = await axios.post(`${API_BASE}/users/register`, {
          walletAddress: address,
          referralCode: referralCode || null
        });
        setUser(res.data.user);
        await loadGameData(address);
      }
    }
  };

  // 加载游戏数据
  const loadGameData = async (address) => {
    try {
      const res = await axios.get(`${API_BASE}/game/data/${address}`);
      setGameData(res.data);
    } catch (error) {
      console.error('加载游戏数据失败:', error);
    }
  };

  // 签到
  const handleSignIn = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/game/signin`, {
        walletAddress: wallet.address
      });
      alert(`签到成功！获得 ${res.data.reward} SHRIMP！\n连续签到 ${res.data.signStreak} 天`);
      await loadGameData(wallet.address);
    } catch (error) {
      alert(error.response?.data?.message || '签到失败');
    } finally {
      setLoading(false);
    }
  };

  // 购买套餐
  const purchasePackage = async (packageType) => {
    if (!confirm(`确定购买 ${packageType} 套餐吗？`)) return;
    
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/game/purchase-package`, {
        walletAddress: wallet.address,
        packageType
      });
      setUser(res.data.user);
      alert('购买成功！');
      await loadGameData(wallet.address);
    } catch (error) {
      alert(error.response?.data?.message || '购买失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* 头部 */}
      <div className="text-center" style={{ padding: '40px 0' }}>
        <h1>🦐 小聋虾 Meme 农场</h1>
        <p style={{ color: 'white', fontSize: '18px' }}>
          建设你的农场，赚取 SHRIMP 代币！
        </p>
      </div>

      {/* 钱包连接 */}
      {!wallet ? (
        <div className="card text-center">
          <h2>连接钱包开始游戏</h2>
          <button 
            className="btn btn-primary" 
            onClick={connectWallet}
            disabled={loading}
          >
            {loading ? '连接中...' : '🔗 连接 MetaMask 钱包'}
          </button>
        </div>
      ) : (
        <>
          {/* 钱包信息 */}
          <div className="wallet-info">
            💰 钱包: {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
          </div>

          {/* 用户信息 */}
          {user && (
            <div className="grid">
              <div className="stat-card">
                <div className="stat-value">{user.signStreak}</div>
                <div className="stat-label">连续签到</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{user.referralCount}</div>
                <div className="stat-label">邀请人数</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{user.totalEarned}</div>
                <div className="stat-label">总收益</div>
              </div>
            </div>
          )}

          {/* 游戏内容 */}
          <div className="card">
            <h2>🎮 游戏操作</h2>
            <div className="grid" style={{ marginBottom: '20px' }}>
              <button 
                className="btn btn-success" 
                onClick={handleSignIn}
                disabled={loading}
              >
                📅 每日签到
              </button>
            </div>

            {/* 套餐选择 */}
            {!user?.isV1 && gameData && (
              <>
                <h3>📦 选择套餐</h3>
                <div className="grid">
                  {gameData.gameConfig.packages.map(pkg => (
                    <div key={pkg.id} className="card building-card">
                      <h4>{pkg.name}</h4>
                      <p>💰 价格: {pkg.price} BNB</p>
                      <p>🏗️ 土地: {pkg.lands}</p>
                      <p>🏪 建筑: {pkg.buildings}</p>
                      {pkg.price > 0 && (
                        <button 
                          className="btn btn-warning"
                          onClick={() => purchasePackage(pkg.id)}
                          disabled={loading}
                        >
                          购买
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* 建筑 */}
            {gameData && (
              <>
                <h3>🏪 建筑商店</h3>
                <div className="grid">
                  {gameData.gameConfig.buildings.map(building => (
                    <div key={building.id} className="card building-card">
                      <h4>{building.name}</h4>
                      <p>📈 产出: {building.output}x</p>
                      <p>💰 价格: {building.price} SHRIMP</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 邀请码 */}
          {user && (
            <div className="card">
              <h3>👥 邀请好友</h3>
              <p>你的邀请码: <strong>{user.referralCode}</strong></p>
              <p>邀请好友获得 10% 手续费分红！</p>
            </div>
          )}
        </>
      )}

      {/* 底部 */}
      <div className="text-center" style={{ padding: '40px 0', color: 'white' }}>
        <p>🦐 小聋虾 Meme 农场 © 2024</p>
      </div>
    </div>
  );
}

export default App;
