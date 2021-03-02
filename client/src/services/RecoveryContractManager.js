import ShardManagerContract from "../contracts/ShardManager.json";
import RecoveryContract from "../contracts/Recovery.json";
import web3Service from "./Web3Service";

import getWeb3 from "../getWeb3";

/**Recovery Contract Manager
 * 
 * The Recovery Contract Manager is created to interface with the recovery smart contract found within the blockchain for each account.
 *  
 * FIRST THINKING FLOW:
 *  - The contract will have to find the  
 */
class RecoveryContractManager{

    constructor(){
        this.web3 = null;
        this.recoveryContractAddress = null;
        this.masterRecoveryContract = null;
        this.nftContractAddress = null;
        this.recoveryContract = null;
        this.inVerify = false;

        this.initWeb3Provider();
    }

    /**Init web 3 Provider
     * 
     * Set the web3 provider for this contract
     * 
     * @param {Object} web3 
     */
    async initWeb3Provider(){
        this.web3 = await getWeb3();
        // Init recovery contract instance
        const networkId = await this.web3.eth.net.getId();
        console.log(networkId);
        const deployedNetwork = ShardManagerContract.networks[networkId];
        console.log(ShardManagerContract.networks)
        this.masterRecoveryContract = new this.web3.eth.Contract(
            ShardManagerContract.abi,
            deployedNetwork && deployedNetwork.address
        ); 

        console.log(this.masterRecoveryContract);
    }

    // getters
    // recoveryContractAddress(){
    //     return this.recoveryContractAddress;
    // }

    // get nftContractAddress(){
    //     return this.nftContractAddress;
    // }

    /**Get Recovery Contract For Address
     * 
     * Query the master recovery contract to get the user of this particular address's recovery contract
     * This contract is stored to the service state and can be accessed from within the application
     * 
     * @param {String} address 
     */
    async getRecoveryContractForAddress(address){
        console.log(address);
        if (!this.masterRecoveryContract){
            await this.initWeb3Provider();
        }
        const recoveryAddress = await this.masterRecoveryContract.methods.checkRecoveryContractAddress(address).call({from: this.web3.currentProvider.selectedAddress});
        console.log(recoveryAddress);
        this.recoveryContractAddress = recoveryAddress;
        this.recoveryContract = new this.web3.eth.Contract(
            RecoveryContract.abi,
            recoveryAddress
        );

        console.log("Recovery contract loaded " + recoveryAddress.toString());
    }

    listenForRecoveryContractCreation(address, callback){
        this.masterRecoveryContract.events.ShardRecoveryStep({ownerAddress: address}).on("data", async (data) => {
            console.log("Attribute update event logged");
            console.log(data);
            if (data.returnValues.step == 0){
                this.getRecoveryContractForAddress(address);
            }

            callback();
          });
          console.log("Event listening started");
    }


    /**Create Recovery Contract
     * 
     * 
     * @param {String} address 
     */
    async createRecoveryContract(address){

        const result = await this.masterRecoveryContract.methods.createRecoveryContract(this.web3.currentProvider.selectedAddress,3)
            .send({from: this.web3.currentProvider.selectedAddress}, function(err, res) {
                if (err){
                    console.log("Failed to create recovery contract");
                    return;
                } 
                console.log("Hash of the transaction" + res);
            });
        
        // get the address of the created contract
        if (result){
            const addrOfRecoveryContract = this.getRecoveryContractForAddress(address);
        }
    }

    /**Check user has recovery contract
     * 
     * @param {String} address 
     */
    async doesUserHaveRecoveryContract(address){
        const recoveryAddress = await this.recoveryContract.methods.checkRecoveryContractAddress.call(address);
        return recoveryAddress ? true : false;
    }


    /**Batch Add Shardholders
     *
     * Call the batchAdd Shardholders method on the user's unique recovery contract.
     * This will add each of the addresses within the shard holders as shard holders in the contract.
     * @param {String[]} shardholders 
     */
    async batchAddShardholders(shardholders){
        // sanity checks 
        if (typeof shardholders !== Array && shardholders.length < 1){
            throw Error("Shardholers must be an array and have more than 1 item - use non batch operation");
        }

        const result = await this.recoveryContract.methods.batchAddShardholder(shardholders)
            .send({from: this.web3.currentProvider.selectedAddress}, function(err, res) {
                if (err){
                    console.log("Batch update failed");
                    return;
                } 
                console.log("Hash of the transaction" + res);
            });
    }

    /**Single Add Shareholder
     * 
     * Add a singlular shareholder to the recovery contract - this is done to make the operation more
     * gas efficient that by adding batches.
     * @param {String} shardholder 
     */
    async singleAddShareholder(shareholder){
        if (typeof shareholder != "string"){
            throw Error("A single shard holder must be a string");
        }

        const result = await this.recoveryContract.methods.addShardholder(shareholder).send(
            {from: this.web3.currentProvider.selectedAddress},
            function(err, res){
                if (err){
                    console.log("Adding shareholder failed");
                    return;
                }
                console.log("Hash of the transaction - single shareholder added - " + res);
            }
        )
    }


    async blackListShareholder(shardholder){
        if (typeof shardholder !== "string"){
            throw Error("A single shard holder must be a string");
        }

        const result = await this.recoveryContract.methods.blackListShardholder(shardholder).send(
            {from: this.web3.currentProvider.selectedAddress},
            function(err, res){
                if (err){
                    console.log("Blacklisting shareholder failed");
                    return;
                }
                console.log("Hash of the transaction - single blacklist added - " + res);
            }
        )
    }

    async batchBlacklistShardholder(shardholders){
        if (typeof shardholders !== "array" && shardholders.length < 1){
            throw Error("Shardholers must be an array and have more than 1 item - use non batch operation");
        }

        const result = await this.recoveryContract.methods.batchBlacklistShardholder(shardholders)
            .send({from: this.web3.currentProvider.selectedAddress}, function(err, res) {
                if (err){
                    console.log("Batch update blacklist failed");
                    return;
                } 
                console.log("Hash of the transaction - batch blacklist - " + res);
            });
    }

    async removeBlackListShareholder(shardholder){
        if (typeof shardholder !== "string"){
            throw Error("A single shard holder must be a string");
        }

        const result = await this.recoveryContract.methods.removeBlacklistShardholder(shardholder).send(
            {from: this.web3.currentProvider.selectedAddress},
            function(err, res){
                if (err){
                    console.log("Removing Blacklisting shareholder failed");
                    return;
                }
                console.log("Hash of the transaction - removal single blacklist added - " + res);
            }
        )
    }


    async batchRemoveBlacklistShardholder(shardholders){
        if (typeof shardholders !== Array && shardholders.length < 1){
            throw Error("Shardholers must be an array and have more than 1 item - use non batch operation");
        }

        const result = await this.recoveryContract.methods.batchBlacklistShardholder(shardholders)
            .send({from: this.web3.currentProvider.selectedAddress}, function(err, res) {
                if (err){
                    console.log("Batch Removal update blacklist failed");
                    return;
                } 
                console.log("Hash of the transaction - removal batch blacklist - " + res);
            });
    }

    async createNewShards(holderAddresses){
        if (typeof holderAddresses !== Array){
            throw Error("Holders must be an array of Strings");
        }

        // store pending shardholders within local storage

    }

    /**
     * Get Shardholders
     * 
     * Requests the contracts current shardholders - returning in two seperate arrays, which addresses are blacklisted or shardholders
     * @returns {Object} {
     *  shardholder,
     *  blacklisted
     * }
     */
    async getShardholders(){
        const shardHoldersResult = await this.recoveryContract.methods.getTrustees().call({from: this.web3.currentProvider.selectedAddress}, function(err, res){
            if (err){
                console.log("Reading shardholders failed");
                return;
            }
            console.log("Shardholders - " + res);
        });

        // check if the provided addresses are confirmed
        var shardHoldersObject = [];
        for (let i =0; i< shardHoldersResult.length; i++){
            const isVerified = await this.recoveryContract.methods.confirmed(shardHoldersResult[i]).call({from: this.web3.currentProvider.selectedAddress});
            console.log(isVerified);
            shardHoldersObject.push({
                address: shardHoldersResult[i],
                verified: isVerified
            });
        }
        console.log("SHARD HOLDERS OBJECT");
        console.log(shardHoldersObject);

        var shardholder = [], blacklisted = [];
        // split the shardholders into active shardholders and those that are currently blacklisted
        for (let i=0; i< shardHoldersObject.length; i++){
            if (await this.recoveryContract.methods.blacklisted(shardHoldersObject[i].address).call({from: this.web3.currentProvider.selectedAddress})){
                blacklisted.push(shardHoldersObject[i]);
            }else if (await this.recoveryContract.methods.shardHolders(shardHoldersObject[i].address).call({from: this.web3.currentProvider.selectedAddress})){
                shardholder.push(shardHoldersObject[i]);
            }
        }
        return {
            shardholder,
            blacklisted
        };
    }

    //-------------------------------------------------------------------------------------------------------------------------------------
    // For when performing verifications from another eth address
    //-------------------------------------------------------------------------------------------------------------------------------------
    async verifyRecoveryContractFromAddress(address){
        this.inVerify = true;
        await this.getRecoveryContractForAddress(address);
        this.recoveryContract.methods.confirmTrustee().send({from: this.web3.currentProvider.selectedAddress}, function(err, res){
            if (err){
                console.log("Verifying trustee failed");
                return;
            }
            console.log("Trustee Verified - Hash " + res);
        });
    }

    async isUserATrustee(address){
        this.inVerify = true;
        await this.getRecoveryContractForAddress(address);
        const isTrustee = await this.recoveryContract.methods.shardHolders(this.web3.currentProvider.selectedAddress).call({from: this.web3.currentProvider.selectedAddress}, function(err, res){
            if (err){
                console.log("Verifying trustee failed");
                return;
            }
            console.log("Trustee Verified " + res);
        });
        return isTrustee;
    }
}

const recoveryContractManager = new RecoveryContractManager();
export default recoveryContractManager;