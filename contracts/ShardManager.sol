pragma solidity ^0.7.4;

contract ShardManager{
    
    // An enum to list what state the recovery of a token is in
    enum RecoveryState{Normal, StandardRecovery, AfterDeath};
    
    struct RecoveryToken {
        RecoveryContract 
    }
    
}