// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.4;

import "./ShardManager.sol";
import "./ShardNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Recovery is Ownable {
    enum RecoveryState {Created, Normal, InRecovery, Death}

    // This contract should be an NFT that is sent to each of the users, containing
    // their encoded shard information

    // a user can revoke a particular shard holder from being user by storing by blacklisting them here
    mapping(address => bool) public shardHolders;
    mapping(address => bool) public blacklisted;
    mapping(address => bool) public confirmed; // trustees can send a transaction from their own account to the contract so that they can show up as confirmed
    mapping(address => string) publicKeys;
    mapping(address => bool) pubKeyGathered;
    uint256 public currentChange; //The block number when a public key was verified, so that the transaction can be found
    address[] trustees;
    uint8 recoveryThreshold = 0;

    // The current recovery state of the contract
    //TODO: Set recovery state along the chain
    RecoveryState recoveryState;
    // Will be set if a trustee has triggered recovery
    address trusteeTriggeredRecovery;
    ShardManager parentContract;
    ShardNFT nftContract;

    event TrusteeVerified(
        address indexed account,
        address owner,
        uint256 previousChange
    );

    /**
     *
     */
    constructor(
        ShardManager _parentContract,
        address _owner,
        uint8 _recoveryThreshold
    ) {
        parentContract = _parentContract;
        nftContract = new ShardNFT(this, _owner);
        transferOwnership(_owner);
        recoveryThreshold = _recoveryThreshold;
    }

    function getNFTAddress() public view onlyOwner returns (address) {
        return address(nftContract);
    }

    function viewWhoTriggeredRecovery() public view returns (address) {
        return address(trusteeTriggeredRecovery);
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
        shardHolders[_toAdd] = true;
        trustees.push(_toAdd);
    }

    function viewShardholder(address _view)
        public
        view
        onlyOwner
        returns (bool)
    {
        return shardHolders[_view];
    }

    /**
     * Blacklist Shard Holder
     *
     * The provided address can will be marked as void by the shard holder
     * Only the owner can provide this operation
     */
    function blackListShardholder(address _toBlacklist) public onlyOwner {
        blacklisted[_toBlacklist] = true;
    }

    function removeBlacklistShardholder(address _toBlacklist) public onlyOwner {
        blacklisted[_toBlacklist] = false;
    }

    function viewBlacklisted(address _view)
        public
        view
        onlyOwner
        returns (bool)
    {
        return blacklisted[_view];
    }

    /** Confirm Trustee
     */
    function confirmTrustee() public {
        require(shardHolders[msg.sender], "Sender is not a trustee");
        confirmed[msg.sender] = true;
        emit TrusteeVerified(msg.sender, this.owner(), currentChange);
        currentChange = block.number;
    }

    function sendShardToShardOwner(address _shardOwner, string memory _shardURI)
        public
    {
        // check that the shard holder it is being sent to is registered
        require(shardHolders[_shardOwner], "Not a valid Trustee");
    }

    /**
     * Trigger Recovery Event
     *
     * Triggering the recovery event will send a recovery NFT to the addresses of the token holders
     * Any of the shard owners can trigger this event
     */
    function triggerRecoveryEvent(string memory _payloadURI) public {
        require(
            shardHolders[msg.sender] && !blacklisted[msg.sender],
            "Not a valid Trustee"
        );
        trusteeTriggeredRecovery = msg.sender;
        // mark the parent contract's state to have been updated
        address _owner = this.owner();

        //TODO: un-comment this line
        // parentContract.updateRecoveryState(
        //     _owner,
        //     address(msg.sender),
        //     uint256(3)
        // );
        // send recovery token to each of the validated shard holders
        for (uint8 j = 0; j < trustees.length; j++) {
            // only send the token if the trustee address has not been blacklisted
            if (shardHolders[trustees[j]] && !blacklisted[trustees[j]]) {
                // Send the shard with the given payload to the list of trustees
                nftContract.distributeShard(trustees[j], _payloadURI);
            }
        }
    }

    function sendShardToRecoveryInitialiser(string memory _payloadURI) public {
        require(
            trusteeTriggeredRecovery != address(0),
            "Recovery not yet initialised"
        );
        require(
            shardHolders[msg.sender] && !blacklisted[msg.sender],
            "Not a valid Trustee"
        );
        // send the encoded payload to the user who initialised recovery
        nftContract.distributeShard(trusteeTriggeredRecovery, _payloadURI);
    }

    /**
     * Destroy Shard contract
     */
    function destroyShardContract() public onlyOwner {}
}
