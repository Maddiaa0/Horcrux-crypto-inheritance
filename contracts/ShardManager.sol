// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.4;

import "./Recovery.sol";

/**
 * TODO: Remember to set this contract as ownable?
 */
contract ShardManager {
    // An enum to list what state the recovery of a token is in
    // enum RecoveryState {Normal, StandardRecovery, AfterDeath}

    // This struct keeps track of who owns what contracts and the location of their recovery contracts
    // struct RecoveryContracts {
    //     address recoveryContractAddress;
    //     RecoveryState recoveryState;
    // }

    event ShardRecoveryStep(
        address indexed ownerAddress,
        address contractAddress
    );

    // Store metadata about who ovms a contract address and the state of the contract -> is it in recovery or is the owner said to have died
    mapping(address => address) public contractMappings;

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
            new Recovery(
                address(this),
                _recoveryContractOwner,
                uint8(_threshold)
            );

        // update the contract mappings struct
        contractMappings[_recoveryContractOwner] = address(
            userRecoveryContract
        );
        // contractMappings[_recoveryContractOwner].recoveryState = RecoveryState
        // .Normal;

        emit ShardRecoveryStep(
            address(_recoveryContractOwner),
            address(userRecoveryContract)
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
        require(sentFromContract && senderIsTrusted, "Sender not trustee");

        // contractMappings[_contractOwner].recoveryState = RecoveryState
        //     .StandardRecovery;

        // emit an evnt notifying that the current step has been updated
        emit ShardRecoveryStep(
            address(_contractOwner),
            address(contractMappings[_contractOwner])
        );
    }

    /**
        @dev Is called by the child recovery contract to update the owner of a recovery contract
     */
    function setNewContractOwner(
        address _newOwner,
        address _currentOwner,
        address _childContractAddr
    ) public {
        require(
            msg.sender == contractMappings[_currentOwner] &&
                contractMappings[_currentOwner] == address(_childContractAddr),
            "Sender not Contract"
        );

        contractMappings[_newOwner] = _childContractAddr;
        // contractMappings[_newOwner].recoveryState = RecoveryState.Normal;
    }
}
