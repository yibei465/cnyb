
const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

// 模拟钱包地址
const TEST_WALLET = '0x1234567890123456789012345678901234567890';
const TEST_WALLET_2 = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';

console.log('🦐 === 小聋虾 Meme 农场测试 ===\n');

async function testGame() {
  try {
    // ===== 测试 1: 检查 API 状态 =====
    console.log('📍 测试 1: 检查 API 状态');
    const statusRes = await axios.get('http://localhost:3000/');
    console.log('✅ API 状态:', statusRes.data);
    console.log('');

    // ===== 测试 2: 注册第一个用户 =====
    console.log('📍 测试 2: 注册用户 A');
    const registerRes1 = await axios.post(`${API_BASE}/users/register`, {
      walletAddress: TEST_WALLET
    });
    console.log('✅ 用户 A 注册成功:', {
      id: registerRes1.data.user.id,
      wallet: registerRes1.data.user.walletAddress,
      referralCode: registerRes1.data.user.referralCode
    });
    const userA = registerRes1.data.user;
    console.log('');

    // ===== 测试 3: 获取用户 A 信息 =====
    console.log('📍 测试 3: 获取用户 A 信息');
    const userRes1 = await axios.get(`${API_BASE}/users/${TEST_WALLET}`);
    console.log('✅ 用户 A 信息:', userRes1.data);
    console.log('');

    // ===== 测试 4: 获取游戏数据 =====
    console.log('📍 测试 4: 获取游戏数据');
    const gameDataRes = await axios.get(`${API_BASE}/game/data/${TEST_WALLET}`);
    console.log('✅ 游戏配置:');
    console.log('   套餐数量:', gameDataRes.data.gameConfig.packages.length);
    console.log('   建筑数量:', gameDataRes.data.gameConfig.buildings.length);
    console.log('');

    // ===== 测试 5: 用户 A 签到 =====
    console.log('📍 测试 5: 用户 A 签到');
    const signRes1 = await axios.post(`${API_BASE}/game/signin`, {
      walletAddress: TEST_WALLET
    });
    console.log('✅ 签到成功:', {
      reward: signRes1.data.reward,
      signStreak: signRes1.data.signStreak
    });
    console.log('');

    // ===== 测试 6: 用户 A 购买套餐 =====
    console.log('📍 测试 6: 用户 A 购买虾农套餐');
    const purchaseRes1 = await axios.post(`${API_BASE}/game/purchase-package`, {
      walletAddress: TEST_WALLET,
      packageType: 'shrimp'
    });
    console.log('✅ 购买成功:', {
      isV1: purchaseRes1.data.user.isV1,
      packageType: purchaseRes1.data.user.packageType
    });
    console.log('');

    // ===== 测试 7: 注册用户 B（使用邀请码）=====
    console.log('📍 测试 7: 注册用户 B（使用邀请码）');
    const registerRes2 = await axios.post(`${API_BASE}/users/register`, {
      walletAddress: TEST_WALLET_2,
      referralCode: userA.referralCode
    });
    console.log('✅ 用户 B 注册成功:', {
      id: registerRes2.data.user.id,
      wallet: registerRes2.data.user.walletAddress,
      usedReferralCode: userA.referralCode
    });
    console.log('');

    // ===== 测试 8: 检查用户 A 的邀请数 =====
    console.log('📍 测试 8: 检查用户 A 的邀请数');
    const userRes1After = await axios.get(`${API_BASE}/users/${TEST_WALLET}`);
    console.log('✅ 用户 A 邀请数:', userRes1After.data.referralCount);
    console.log('');

    // ===== 测试 9: 获取排行榜 =====
    console.log('📍 测试 9: 获取收益排行榜');
    const leaderboardRes = await axios.get(`${API_BASE}/users/leaderboard/earnings`);
    console.log('✅ 排行榜用户数:', leaderboardRes.data.length);
    if (leaderboardRes.data.length > 0) {
      console.log('   第一名:', leaderboardRes.data[0].username || 'Shrimp Farmer');
    }
    console.log('');

    // ===== 测试 10: 用户 B 签到 =====
    console.log('📍 测试 10: 用户 B 签到');
    const signRes2 = await axios.post(`${API_BASE}/game/signin`, {
      walletAddress: TEST_WALLET_2
    });
    console.log('✅ 签到成功:', {
      reward: signRes2.data.reward,
      signStreak: signRes2.data.signStreak
    });
    console.log('');

    console.log('🎉'.repeat(30));
    console.log('🎉 所有测试通过！游戏功能正常！ 🎉');
    console.log('🎉'.repeat(30));
    console.log('');
    console.log('🦐 现在可以在浏览器中打开: http://localhost:5173');
    console.log('🦐 连接 MetaMask 钱包开始玩！');

  } catch (error) {
    console.error('❌ 测试失败:', error.response?.data || error.message);
    process.exit(1);
  }
}

testGame();
