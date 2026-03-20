
const { ethers } = require("hardhat");

async function main() {
  console.log("🦐 开始部署小聋虾 Meme 农场...\n");

  const [deployer] = await ethers.getSigners();
  console.log("部署账户地址:", deployer.address);
  console.log("账户余额:", (await deployer.getBalance()).toString(), "\n");

  // 1. 部署 SHRIMP 代币合约
  console.log("1. 部署 SHRIMP 代币合约...");
  const SHRIMP = await ethers.getContractFactory("SHRIMP");
  const shrimp = await SHRIMP.deploy();
  await shrimp.deployed();
  console.log("   SHRIMP 合约地址:", shrimp.address);

  // 2. 部署游戏主合约
  console.log("\n2. 部署游戏主合约...");
  const MemeFarm = await ethers.getContractFactory("MemeFarm");
  
  // 设置运营钱包和团队钱包（这里先用部署者地址）
  const operationalWallet = deployer.address;
  const teamWallet = deployer.address;
  
  const memeFarm = await MemeFarm.deploy(
    shrimp.address,
    operationalWallet,
    teamWallet
  );
  await memeFarm.deployed();
  console.log("   MemeFarm 合约地址:", memeFarm.address);

  // 3. 设置游戏合约地址到代币合约
  console.log("\n3. 配置合约...");
  await shrimp.setGameContract(memeFarm.address);
  console.log("   游戏合约地址已设置到代币合约");

  // 4. 输出部署信息
  console.log("\n" + "=".repeat(60));
  console.log("🦐 部署完成！");
  console.log("=".repeat(60));
  console.log("SHRIMP 代币合约:", shrimp.address);
  console.log("MemeFarm 游戏合约:", memeFarm.address);
  console.log("部署者:", deployer.address);
  console.log("=".repeat(60));

  // 5. 保存部署信息
  const fs = require("fs");
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    chainId: (await ethers.provider.getNetwork()).chainId,
    deployer: deployer.address,
    shrimpToken: shrimp.address,
    memeFarm: memeFarm.address,
    deployedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(
    "./deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n部署信息已保存到 deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
