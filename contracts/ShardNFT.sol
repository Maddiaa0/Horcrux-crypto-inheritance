// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ShardNFT is ERC721 {
    // I want this contract to mint new tokens that point to an IPFS object with the encrypted shard within it? or do i want the

    using Counters for Counters.Counter;
    Counters.Counter private _shardNumber;

    address owner;

    // Recovery _parentContract, address _owner
    constructor() ERC721("Recovery", "rNFT") {
        owner = tx.origin;
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

    /// @notice Returns a list of all Shard IDs assigned to an address.
    /// @param _owner The owner whose NFTs we are interested in.
    /// @dev This method MUST NEVER be called by smart contract code. First, it's fairly
    ///  expensive (it walks the entire Kitty array looking for cats belonging to owner),
    ///  but it also returns a dynamic array, which is only supported for web3 calls, and
    ///  not contract-to-contract calls.
    function tokensOfOwner(address _owner)
        external
        view
        returns (uint256[] memory)
    {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 totalShards = totalSupply();
            uint256 resultIndex = 0;

            // We count on the fact that all shards have IDs starting at 1 and increasing
            // sequentially up to the totalShard count.
            uint256 shardId;

            for (shardId = 1; shardId <= totalShards; shardId++) {
                if (ownerOf(shardId) == _owner) {
                    result[resultIndex] = shardId;
                    resultIndex++;
                }
            }

            return result;
        }
    }
}
