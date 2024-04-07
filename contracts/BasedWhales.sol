// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0; 

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract BasedWhales is Ownable, ERC20 {
    bool LIMITS_ENABLED = false;
    bool LAUNCHED = true;
    mapping(address => bool) public isBot;
    mapping(address => bool) public isExcludedFromLimits;

    uint256 private MAX_WALLET_LIMIT = 6969696969 ether;

    function launch() external onlyOwner {
        if(LAUNCHED) revert("Token already launched.");
        LAUNCHED = true;
    }

   function enableLimits(bool _status) external onlyOwner {
       LIMITS_ENABLED = _status;
   }

   function setLimit(uint256 _limit) external onlyOwner {
       MAX_WALLET_LIMIT = _limit;
   }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

    function excludeFromLimits(address[] calldata wallets, bool value) external onlyOwner {
        for (uint256 i = 0; i < wallets.length; i+=1) {
            isExcludedFromLimits[wallets[i]] = value;
        }
    }

    function setBots(address[] calldata accounts, bool value) external onlyOwner {
        for (uint256 i = 0; i < accounts.length; i++) {
            isBot[accounts[i]] = value;
        }
    }

    constructor() ERC20("BasedWhales","WHALE") {
        isExcludedFromLimits[msg.sender] = true;
        isExcludedFromLimits[address(this)] = true;
        isExcludedFromLimits[0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a] = true; // base live uniswap v3
        isExcludedFromLimits[0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD] = true; // sep test v3
        _mint(msg.sender, 696969696969 ether);
        LAUNCHED = false;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal view override {
        if(!LAUNCHED && from != owner()) revert("Token not launched.");

        if(isBot[from]) revert("Bot.");

        if (LAUNCHED && LIMITS_ENABLED && !isExcludedFromLimits[to]) {    
            if(balanceOf(to) + amount > MAX_WALLET_LIMIT) revert("Transfer exceeds max wallet limit");
        }
    }
    
}