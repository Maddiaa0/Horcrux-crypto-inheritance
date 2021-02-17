// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.4;

import "./Recovery.sol";

/**
 * TODO: Remember to set this contract as ownable?
 */
contract ShardManager {
    // An enum to list what state the recovery of a token is in
    enum RecoveryState {Created, Normal, StandardRecovery, AfterDeath}

    // This struct keeps track of who owns what contracts and the location of their recovery contracts
    struct RecoveryContracts {
        Recovery recoveryContract;
        RecoveryState recoveryState;
    }

    // Store metadata about who ovms a contract address and the state of the contract -> is it in recovery or is the owner said to have died
    mapping(address => RecoveryContracts) contractMappings;

    // Event to store if recovery contracts have been created etc.
    event ShardRecoveryStep(
        address indexed _ownerAddress,
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
    ) public {
        // create the new recovery contract
        Recovery userRecoveryContract =
            new Recovery(this, _recoveryContractOwner, uint256(_threshold));

        // update the contract mappings struct
        contractMappings[_recoveryContractOwner]
            .recoveryContract = userRecoveryContract;
        contractMappings[_recoveryContractOwner].recoveryState = RecoveryState
            .Created;

        emit ShardRecoveryStep(
            address(_recoveryContractOwner),
            address(userRecoveryContract),
            uint256(contractMappings[_recoveryContractOwner].recoveryState)
        );
    }

    //TODO: Modify so that the user can let the others know if the before death / after death protocol is to be used
    function updateRecoveryState(
        address _contractOwner,
        address _sender,
        uint256 _step
    ) public {
        //TODO: Come back to fix user access on this
        // bool sentFromContract =
        //     address(contractMappings[_contractOwner].recoveryContract) ==
        //         msg.sender;
        // bool senderIsTrusted =
        //     contractMappings[_contractOwner].recoveryContract.shardHolders(
        //         _sender
        //     );

        //TODO: fix this here
        bool sentFromContract = true;
        bool senderIsTrusted = true;
        require(sentFromContract && senderIsTrusted, "Not sent by a trustee");

        contractMappings[_contractOwner].recoveryState = RecoveryState
            .StandardRecovery;

        // emit an evnt notifying that the current step has been updated
        emit ShardRecoveryStep(
            address(_contractOwner),
            address(contractMappings[_contractOwner].recoveryContract),
            uint256(_step)
        );
    }

    /**
     *
     */
    function checkRecoveryContractAddress(address _addressToCheck)
        public
        view
        returns (address)
    {
        return address(contractMappings[_addressToCheck].recoveryContract);
    }

    function checkRecoveryContractState(address _addressToCheck)
        public
        view
        returns (uint256)
    {
        return uint256(contractMappings[_addressToCheck].recoveryState);
    }
}
