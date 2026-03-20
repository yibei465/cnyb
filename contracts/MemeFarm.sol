
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MemeFarm is Ownable, ReentrancyGuard {
    // ============ 数据结构 ============
    
    struct Building {
        uint256 id;
        string name;
        uint256 baseOutput;
        uint256 multiplier;
        uint256 price;
    }
    
    struct UserBuilding {
        uint256 buildingId;
        uint256 level;
        uint256 lastCollectTime;
    }
    
    struct User {
        address addr;
        uint256 lands;
        mapping(uint256 => UserBuilding) buildings;
        uint256 buildingCount;
        address referrer;
        uint256 referralCount;
        uint256 totalEarned;
        uint256 lastSignTime;
        uint256 signStreak;
        uint256 registerTime;
        bool isV1;
    }
    
    struct Package {
        string name;
        uint256 price;
        uint256 lands;
        uint256 buildings;
        uint256 specialBuildings;
    }
    
    // ============ 状态变量 ============
    
    IERC20 public shrimpToken;
    
    mapping(address => User) public users;
    mapping(uint256 => Building) public buildings;
    mapping(uint256 => Package) public packages;
    
    uint256 public buildingCount;
    uint256 public packageCount;
    uint256 public totalUsers;
    uint256 public totalBNBCollected;
    
    // BNB 分配
    uint256 public constant BUYBACK_RATE = 70;
    uint256 public constant OPERATIONAL_RATE = 20;
    uint256 public constant TEAM_RATE = 10;
    
    address public operationalWallet;
    address public teamWallet;
    
    // ============ 事件 ============
    
    event UserRegistered(address indexed user, address referrer, uint256 packageId);
    event BuildingPurchased(address indexed user, uint256 buildingId);
    event BuildingUpgraded(address indexed user, uint256 buildingId, uint256 newLevel);
    event RewardsCollected(address indexed user, uint256 amount);
    event ReferralReward(address indexed referrer, address indexed user, uint256 amount);
    event BNBSpent(address indexed user, uint256 amount);
    event PackagePurchased(address indexed user, uint256 packageId, uint256 price);
    
    // ============ 构造函数 ============
    
    constructor(address _shrimpToken, address _operationalWallet, address _teamWallet) {
        shrimpToken = IERC20(_shrimpToken);
        operationalWallet = _operationalWallet;
        teamWallet = _teamWallet;
        
        // 初始化建筑
        _addBuilding("Fruit Shop", 1, 1, 1000);
        _addBuilding("Binance Tower", 2, 2, 2000);
        _addBuilding("Lobster Restaurant", 3, 3, 3000);
        _addBuilding("Diamond Mine", 5, 5, 5000);
        _addBuilding("Shrimp Castle", 10, 10, 10000);
        
        // 初始化套餐
        _addPackage("Shrimp Farmer", 0.05 ether, 6, 2, 1);
        _addPackage("Shrimp Boss", 0.1 ether, 9, 3, 1);
        _addPackage("Shrimp King", 0.5 ether, 16, 5, 2);
        _addPackage("Free Trial", 0, 1, 1, 0);
    }
    
    // ============ 内部函数 ============
    
    function _addBuilding(string memory name, uint256 baseOutput, uint256 multiplier, uint256 price) internal {
        buildingCount++;
        buildings[buildingCount] = Building(buildingCount, name, baseOutput, multiplier, price);
    }
    
    function _addPackage(string memory name, uint256 price, uint256 lands, uint256 buildings, uint256 specialBuildings) internal {
        packageCount++;
        packages[packageCount] = Package(name, price, lands, buildings, specialBuildings);
    }
    
    function _calculateUpgradeCost(uint256 level) internal pure returns (uint256) {
        return level * 100;
    }
    
    function _calculateOutput(UserBuilding memory userBuilding, Building memory building) internal pure returns (uint256) {
        return building.baseOutput * userBuilding.level * building.multiplier;
    }
    
    // ============ 用户函数 ============
    
    function register(uint256 packageId, address referrer) external payable nonReentrant {
        require(!users[msg.sender].isV1, "Already registered");
        require(packageId > 0 && packageId <= packageCount, "Invalid package");
        
        Package storage pkg = packages[packageId];
        require(msg.value >= pkg.price, "Insufficient BNB");
        
        User storage user = users[msg.sender];
        user.addr = msg.sender;
        user.lands = pkg.lands;
        user.registerTime = block.timestamp;
        user.isV1 = true;
        
        if (referrer != address(0) && users[referrer].isV1) {
            user.referrer = referrer;
            users[referrer].referralCount++;
        }
        
        // 给初始建筑
        for (uint256 i = 0; i < pkg.buildings; i++) {
            user.buildingCount++;
            user.buildings[user.buildingCount] = UserBuilding(1, 1, block.timestamp);
        }
        
        // 给特殊建筑
        for (uint256 i = 0; i < pkg.specialBuildings; i++) {
            user.buildingCount++;
            user.buildings[user.buildingCount] = UserBuilding(2, 1, block.timestamp);
        }
        
        // 分发 BNB
        if (msg.value > 0) {
            _distributeBNB(msg.value);
        }
        
        // 给新手奖励
        shrimpToken.transfer(msg.sender, 320 * 10**18);
        
        totalUsers++;
        emit UserRegistered(msg.sender, referrer, packageId);
        emit PackagePurchased(msg.sender, packageId, pkg.price);
    }
    
    function purchaseBuilding(uint256 buildingId) external nonReentrant {
        User storage user = users[msg.sender];
        require(user.isV1, "Not registered");
        require(buildingId > 0 && buildingId <= buildingCount, "Invalid building");
        require(user.buildingCount < user.lands, "No free land");
        
        Building storage building = buildings[buildingId];
        
        // 消耗 SHRIMP
        shrimpToken.transferFrom(msg.sender, address(this), building.price);
        
        // 销毁代币
        (bool success, ) = address(shrimpToken).call(
            abi.encodeWithSignature("burn(uint256)", building.price)
        );
        require(success, "Burn failed");
        
        user.buildingCount++;
        user.buildings[user.buildingCount] = UserBuilding(buildingId, 1, block.timestamp);
        
        emit BuildingPurchased(msg.sender, buildingId);
    }
    
    function upgradeBuilding(uint256 userBuildingId) external nonReentrant {
        User storage user = users[msg.sender];
        require(user.isV1, "Not registered");
        require(userBuildingId > 0 && userBuildingId <= user.buildingCount, "Invalid building");
        
        UserBuilding storage userBuilding = user.buildings[userBuildingId];
        require(userBuilding.level < 50, "Max level reached");
        
        uint256 upgradeCost = _calculateUpgradeCost(userBuilding.level + 1);
        
        // 消耗 SHRIMP
        shrimpToken.transferFrom(msg.sender, address(this), upgradeCost * 10**18);
        
        // 销毁代币
        (bool success, ) = address(shrimpToken).call(
            abi.encodeWithSignature("burn(uint256)", upgradeCost * 10**18)
        );
        require(success, "Burn failed");
        
        userBuilding.level++;
        
        emit BuildingUpgraded(msg.sender, userBuildingId, userBuilding.level);
    }
    
    function collectRewards() external nonReentrant {
        User storage user = users[msg.sender];
        require(user.isV1, "Not registered");
        
        uint256 totalReward = 0;
        
        for (uint256 i = 1; i <= user.buildingCount; i++) {
            UserBuilding storage userBuilding = user.buildings[i];
            Building memory building = buildings[userBuilding.buildingId];
            
            uint256 timePassed = block.timestamp - userBuilding.lastCollectTime;
            uint256 outputPerSecond = _calculateOutput(userBuilding, building);
            uint256 reward = outputPerSecond * timePassed;
            
            totalReward += reward;
            userBuilding.lastCollectTime = block.timestamp;
        }
        
        if (totalReward > 0) {
            shrimpToken.transfer(msg.sender, totalReward * 10**18);
            user.totalEarned += totalReward;
            
            emit RewardsCollected(msg.sender, totalReward);
        }
    }
    
    function dailySign() external nonReentrant {
        User storage user = users[msg.sender];
        require(user.isV1, "Not registered");
        
        uint256 oneDay = 1 days;
        bool canSign = block.timestamp >= user.lastSignTime + oneDay;
        require(canSign, "Already signed today");
        
        // 检查连续签到
        if (block.timestamp >= user.lastSignTime + 2 days) {
            user.signStreak = 1;
        } else {
            user.signStreak++;
        }
        
        user.lastSignTime = block.timestamp;
        
        // 签到奖励: 10-100 递增
        uint256 reward = 10 * user.signStreak;
        if (reward > 100) reward = 100;
        
        shrimpToken.transfer(msg.sender, reward * 10**18);
    }
    
    // ============ 内部函数 ============
    
    function _distributeBNB(uint256 amount) internal {
        uint256 buybackAmount = amount * BUYBACK_RATE / 100;
        uint256 operationalAmount = amount * OPERATIONAL_RATE / 100;
        uint256 teamAmount = amount * TEAM_RATE / 100;
        
        // 这里简单处理，实际项目中需要实现回购逻辑
        payable(operationalWallet).transfer(operationalAmount);
        payable(teamWallet).transfer(teamAmount);
        
        totalBNBCollected += amount;
    }
    
    // ============ 管理员函数 ============
    
    function withdrawBNB() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    function setWallets(address _operationalWallet, address _teamWallet) external onlyOwner {
        operationalWallet = _operationalWallet;
        teamWallet = _teamWallet;
    }
}
