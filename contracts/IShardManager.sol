pragma solidity ^0.7.4;

interface IShardManager {
    // Event to store if recovery contracts have been created etc.
    event ShardRecoveryStep(
        address indexed ownerAddress,
        address contractAddress,
        uint256 step
    );

    /** Create shard contract
     *
     * Any user wishing to initiate on chain recovery can interact with this contract in order to trigger an
     * on chain recovery mechanism
     */
    function createRecoveryContract(
        address _recoveryContractOwner,
        uint256 _threshold
    ) external;

    //TODO: Modify so that the user can let the others know if the before death / after death protocol is to be used
    function updateRecoveryState(
        address _contractOwner,
        address _sender,
        uint256 _step
    ) external;

    /**
     *
     */
    function checkRecoveryContractAddress(address _addressToCheck)
        external
        returns (address);

    function checkRecoveryContractState(address _addressToCheck)
        external
        returns (uint256);

    /**
        @dev Is called by the child recovery contract to update the owner of a recovery contract
     */
    function setNewContractOwner(
        address _newOwner,
        address _currentOwner,
        address _childContractAddr
    ) external;
}
