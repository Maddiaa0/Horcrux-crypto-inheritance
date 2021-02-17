// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./Recovery.sol";

contract ShardNFT is ERC721 {
    // I want this contract to mint new tokens that point to an IPFS object with the encrypted shard within it? or do i want the

    using Counters for Counters.Counter;
    Counters.Counter private _shardNumber;

    Recovery parentContract;
    address owner;

    // Recovery _parentContract, address _owner
    constructor(Recovery _parentContract, address _owner)
        ERC721("Recovery", "rNFT")
    {
        parentContract = _parentContract;
        owner = _owner;
    }

    /**Sends a token NFT to a given address
     *
     *
     */
    function distributeShard(address _shardOwner, string memory tokenURI)
        public
        returns (uint256)
    {
        //TODO: Uncomment security checks
        // can only be performed by the parent contract owner or a shard owner
        // address contractOwner = parentContract.owner();
        // bool isShardHolder = parentContract.viewShardholder(msg.sender);
        // require(
        //     contractOwner == msg.sender || isShardHolder,
        //     "Not a valid Trustee"
        // );

        _shardNumber.increment();

        uint256 newShardId = _shardNumber.current();
        _mint(_shardOwner, newShardId);
        _setTokenURI(newShardId, tokenURI);

        return newShardId;
    }
}
