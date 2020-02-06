pragma solidity ^0.5.13;

import "./ERC20.sol";
import "./Ownable.sol";

contract KauriStaking is Ownable {

    event TokensStaked(address staker, uint256 time, uint256 duration, uint256 amount);
    event TokensUnstaked(address staker, uint256 time, uint256 amount, uint256 remaining);

    ERC20 public token;

    struct Staked {
        uint256 time;
        uint256 duration;
        uint256 amount;
    }

    mapping(address => Staked) private stakedTokens;

    constructor(ERC20 _token) public {
        token = _token;
    }

    function stakeTokens(uint256 _amount, uint256 _duration) public {
        require(stakedTokens[msg.sender].amount == 0, "some tokens are already staked for this address");
        token.transferFrom(msg.sender, address(this), _amount);
        stakedTokens[msg.sender] = Staked(now, _duration, _amount);
        emit TokensStaked(msg.sender, now, _duration, _amount);
    }

    function stakeTokensFor(address _staker, uint256 _amount, uint256 _duration) public onlyOwner {
        require(stakedTokens[_staker].amount == 0, "some tokens are already staked for this address");
        token.transferFrom(msg.sender, address(this), _amount);
        stakedTokens[_staker] = Staked(now, _duration, _amount);
        emit TokensStaked(_staker, now, _duration, _amount);
    }

    function withdrawTokens(uint256 _amount) public {
        Staked memory staked = stakedTokens[msg.sender];
        require(!isLocked(now, staked.time, staked.duration), "tokens are still locked");
        require(staked.amount >= _amount, "not enough tokens");
        token.transfer(msg.sender, _amount);
        if(staked.amount == _amount){
            //withdrawing all
            stakedTokens[msg.sender] = Staked(0, 0, 0);
        } else {
            stakedTokens[msg.sender] = Staked(staked.time, staked.duration, staked.amount - _amount);
        }
        emit TokensUnstaked(msg.sender, now, _amount, staked.amount - _amount);
    }

    function isLocked(uint256 _now, uint256 _time, uint256 _duration) internal pure returns (bool) {
        return _now >= _time + _duration ? false:true;
    }

    function stakedDetails(address _staker) public view returns (uint256, uint256, uint256, bool) {
        Staked memory staked = stakedTokens[_staker];
        return (staked.time,
        staked.duration,
        staked.amount,
        isLocked(now, staked.time, staked.duration));
    }
}
