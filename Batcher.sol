
pragma solidity ^0.8.0; 
pragma abicoder v2;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Batcher is Ownable {
    constructor() {

    }

    function batchSend(address[] memory targets, uint[] memory values, bytes[] memory datas) public payable onlyOwner {
        for (uint i = 0; i < targets.length; i++) {
            (bool success,) = targets[i].call{value:values[i]}(datas[i]);
            if (!success) revert('transaction failed');
        }
    }
}