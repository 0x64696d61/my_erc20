// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract ERC20 {
    uint8 public decimals;
    string public name;
    string public symbol;
    address private _owner;
    uint256 private _total_supply;

    constructor() {
        _owner = msg.sender;
        name = 'my_super_token';
        symbol = 'MST';
        decimals = 18;
        mint(_owner, 100 * 10 ** decimals);
    }

    modifier ownerOnly {
        require(msg.sender == _owner, "Access denied");
        _;
    }

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _sender, uint256 _value);

    function transfer(address to, uint256 value) public returns (bool success)
    {
        require(_balances[msg.sender] >= value, 'Not enough money');

        _balances[msg.sender] -= value;
        _balances[to] += value;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    function transferFrom(address from, address to, uint256 value) public returns (bool success)
    {
        uint256 _allowance = allowance(from, msg.sender);
        require(value < type(uint256).max, 'Incorrect value');
        require(_balances[from] >= value, 'Balance size to small');
        require(value <= _allowance, 'The amount exceeds the allowable amount');

        _allowances[from][msg.sender] -= value;
        _balances[from] -= value;
        _balances[to] += value;
        emit Transfer(from, to, value);
        return true;
    }

    function mint(address account, uint256 amount) public ownerOnly
    {
        require(account != address(0), 'Wrong address');

        _total_supply += amount;
        _balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function burn(address account, uint256 amount) external ownerOnly
    {
        require(account != address(0), 'Wrong address');
        require(_balances[account] >= amount, 'Balance to small');

        _total_supply -= amount;
        _balances[account] -= amount;
        emit Transfer(account, address(0), amount);
    }

    function approve(address spender, uint256 value) public returns (bool success)
    {
        require(value >= 0, 'Invalid value');

        _allowances[msg.sender][spender] = value;
        return true;
    }

    function allowance(address owner, address spender) public view returns (uint256 remaining)
    {
        return _allowances[owner][spender];
    }

    function balanceOf(address owner) external view returns (uint256 balance)
    {
        return _balances[owner];
    }

    function totalSupply() external view returns (uint256)
    {
        return _total_supply;
    }

}