
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SHRIMP is ERC20, Ownable, ReentrancyGuard {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**decimals();
    uint256 public totalBurned;
    
    // 游戏合约地址
    address public gameContract;
    
    event TokenBurned(address indexed burner, uint256 amount);
    
    constructor() ERC20("Shrimp Token", "SHRIMP") {
        // 铸造 10亿 代币给合约部署者
        _mint(msg.sender, MAX_SUPPLY);
    }
    
    // 设置游戏合约地址
    function setGameContract(address _gameContract) external onlyOwner {
        gameContract = _gameContract;
    }
    
    // 游戏合约可以 mint 代币给玩家
    function mintToPlayer(address to, uint256 amount) external nonReentrant {
        require(msg.sender == gameContract, "Only game contract");
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
    
    // 销毁代币（游戏内消费）
    function burnFromUser(address from, uint256 amount) external nonReentrant {
        require(msg.sender == gameContract, "Only game contract");
        _burn(from, amount);
        totalBurned += amount;
        emit TokenBurned(from, amount);
    }
    
    // 用户主动销毁
    function burn(uint256 amount) external nonReentrant {
        _burn(msg.sender, amount);
        totalBurned += amount;
        emit TokenBurned(msg.sender, amount);
    }
}
