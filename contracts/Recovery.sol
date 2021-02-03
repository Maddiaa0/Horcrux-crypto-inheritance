pragma solidity ^0.7.4;

import "./ShardManager";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";

contract Recovery is Ownable {
    // This contract should be an NFT that is sent to each of the users, containing
    // their encoded shard information

    // a user can revoke a particular shard holder from being user by storing by blacklisting them here
    mapping(address => bool) shardHolders;
    mapping(address => bool) pubKeyGathered;
    address owner;

    // each user will send a transaction to the block chain which will get their public key
    mapping(address => string) publicKeys;

    // The parent contract
    ShardManager parentContract;

    // The number of returned NFTs to house to perform recovery

    /**
     *
     */

    constructor(
        address _owner,
        ShardManager _parentContract,
        uint256 _recoveryThreshold
    ) {
        parentContract = _parentContract;

        // not sure what to do about recovery thresh rn
    }

    /*
        Idea that when a user sends a recovery request to this contract it will contact the other shard holders
    */

    /*
        add Shard holder
        
        The owner of this shard contract can set a shard holder for themselves, this will be a number 
        of ethereum addresses that will then be marked and stored.
        Only the owner can perform this operation
    */
    function addShardholder(address _toAdd) public onlyOwner {
        // Set the provided address as a shard holder
        shardHolders(_toAdd) = true;
    }

    /**
     * Blacklist Shard Holder
     *
     * The provided address can will be marked as void by the shard holder
     * Only the owner can provide this operation
     */
    function blackListShardholder() public onlyOwner {}

    /**
     * Trigger Recovery Event
     *
     * Triggering the recovery event will send a recovery NFT to the addresses of the token holders
     * Any of the shard owners can trigger this event
     */
    function triggerRecoveryEvent() public {}

    /**
     * Destroy Shard contract
     */
    function destroyShardContract() public onlyOwner {}
}
