pragma solidity ^0.8.0;

contract Example {
  address public owner;
  uint256 public value;

  // 定义了一个名为onlyOwner的函数修饰符（如果没有参数，可以省略()
  modifier onlyOwner() {
    require(msg.sender == owner, 'Only the contract owner can call this function.');
    _; // 继续执行被修饰的函数（在下一节中会讲）
  }

  constructor() {
    owner = msg.sender;
  }

  // 被onlyOwner修饰的函数（后面会讲）
  function setValue(uint256 _newValue) public onlyOwner {
    value = _newValue;
  }
}
