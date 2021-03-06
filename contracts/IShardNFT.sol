// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.4;

interface IShardNFT {
    /**Sends a token NFT to a given address
     *
     *
     */
    function distributeShard(address _shardOwner, string memory tokenURI)
        external
        returns (uint256);
}
