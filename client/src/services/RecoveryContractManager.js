import ShardManagerContract from "../contracts/ShardManager.json";
import RecoveryContract from "../contracts/Recovery.json";
import NFTContract from "../contracts/ShardNFT.json";

import getWeb3 from "../getWeb3";
import Common from "ethereumjs-common";
import CryptoManager from "./CryptoManager";
import cryptoManager from "./CryptoManager";
import keyManager from "./KeyManager";
import CASManager from "./CasManager";
import BN from "bn.js";

import publicKeyToAddress from 'ethereum-public-key-to-address';

// helper function
var _secp256k = require('secp256k1');

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
        this.nftContract = null;
        this.recoveryContract = null;
        this.truffleRecoveryContract = null;
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
        console.log(address);
        const recoveryAddress = await this.masterRecoveryContract.methods.contractMappings(address.toLowerCase()).call();
        console.log(recoveryAddress);
        this.recoveryContractAddress = recoveryAddress;
        this.recoveryContract = new this.web3.eth.Contract(
            RecoveryContract.abi,
            recoveryAddress
        );

        // TODO: work out why this is triggering an ownable response
        // get the NFT instance address 
        const nftInstanceAddress = await this.recoveryContract.methods.getNFTAddress().call();
        this.nftContractAddress = nftInstanceAddress;
        this.nftContract = await new this.web3.eth.Contract(NFTContract.abi, nftInstanceAddress);
            
        console.log("Recovery contract loaded " + recoveryAddress.toString());
    }

    listenForRecoveryContractCreation(address, callback){
        this.masterRecoveryContract.events.ShardRecoveryStep({ownerAddress: address}).on("data", async (data) => {
            console.log("Attribute update event logged");
            console.log(data);
            if (data.returnValues.step === 0){
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

        //todo: move this to a favourable location - and move to after contract generation
        // once the recovery contract is developed - create shards
        const mnem = keyManager.getMnemonicFromStorage("password");
        await cryptoManager.createSharesAndKeepInStorage(mnem, 3, "password");

        await cryptoManager.getSharesFromStorage("password");

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


        console.log(shardholders);
        await this.recoveryContract.methods.batchAddShardholder(shardholders)
            .send({from: this.web3.currentProvider.selectedAddress}, function(err, res) {
                if (err){
                    console.log("Batch update failed");
                    return;
                } 
                console.log("Hash of the transaction" + res);
            });
    }

    async batchBlacklistShardholder(shardholders){
        if (typeof shardholders !== Array && shardholders.length < 1){
            throw Error("Shardholers must be an array and have more than 1 item - use non batch operation");
        }


        await this.recoveryContract.methods.batchBlacklistShardholder(shardholders)
            .send({from: this.web3.currentProvider.selectedAddress}, function(err, res) {
                if (err){
                    console.log("Batch update blacklist failed");
                    return;
                } 
                console.log("Hash of the transaction - batch blacklist - " + res);
            });
    }


    async batchRemoveBlacklistShardholder(shardholders){
        if (shardholders.length < 1 ){
            throw Error("Shardholers must be an array");
        }

        await this.recoveryContract.methods.batchRemoveBlacklistShardholder(shardholders)
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
        console.log(this.recoveryContract);
        const shardHoldersResult = await this.recoveryContract.methods.getTrustees().call();
        //{from: this.web3.currentProvider.selectedAddress}, function(err, res){
        //     if (err){
        //         console.log("Reading shardholders failed");
        //         return;
        //     }
        //     console.log("Shardholders - " + res);
        // }

        // check if the provided addresses are confirmed
        var shardHoldersObject = [];
        for (let i =0; i< shardHoldersResult.length; i++){
            const isVerified = await this.recoveryContract.methods.confirmed(shardHoldersResult[i]).call({from: this.web3.currentProvider.selectedAddress});
            var sentShard = false;
            
            if (isVerified){
                const balance = await this.nftContract.methods.balanceOf(shardHoldersResult[i]).call();
                if (balance > 0) sentShard = true;
            }

            console.log(isVerified);
            shardHoldersObject.push({
                address: shardHoldersResult[i],
                verified: isVerified,
                sentShard: sentShard
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

    async transferOwnerShip(address, callback){
        this.recoveryContract.methods.transferOwnerShip(address).call({from: this.web3.currentProvider.selectedAddress}, function(err, res){
            if (err){
                console.log("Transferring Ownership failed");
                callback(false);       
            }
            console.log("New owner transaction hash - " + res);
            callback(true);
        });
    }

    //-------------------------------------------------------------------------------------------------------------------------------------
    // For when performing verifications from another eth address
    //-------------------------------------------------------------------------------------------------------------------------------------
    async verifyRecoveryContractFromAddress(address){

        // create a signed transaction that will be able to be verified
        // let tx_builder = this.recoveryContract.methods.confirmTrustee();
        // let encoded_tx = tx_builder.encodeABI();

        // const sig = this.web3.personal.sign(this.web3.fromUtf8("message"), this.web3.currentProvider.selectedAddress, console.log);
        
        // const sig = this.web3.eth.sign(this.web3.currentProvider.selectedAddress, "Verify", console.log());


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


    /**Recover public key from user
     * 
     * Reads through the event logs to find the block in which the user's verification transaction takes place.
     * - This log should include the block in which the transaction was mined.
     * - Find the transaction hash and, v,r,s variables to reconstruct the user's public key!
     * 
     * TODO: the current value of index being passed in IS HARDCODED from the options selected on the settings page.
     *      this needs to be fixed, to get the shard index of the last issued shard!!!!!
     * 
     * @param {String} address 
     */
    async recoverPublicKeyFromUser(address, index){
        // check address is verified
        const isVerified = await this.recoveryContract.methods.confirmed(address).call();
        if (!isVerified) return null;
        
        // get the block number in which the confirm took place
        const blockNo = await this.recoveryContract.methods.confirmedBlockNo(address).call();
        const block = await this.web3.eth.getBlock(blockNo);
        const tx = await this.web3.eth.getTransaction(block.transactions[0]);
        
        const common = new Common.forCustomChain(
            "mainnet",
            {
                name:"custom",
                networkId: "0x1691",
                chainId: "0x539",
            },
            "petersburg"
        );
        const EthereumTx = require('ethereumjs-tx').Transaction;
        const txObj = {
            // from: tx.from,
            gas: `0x${parseInt(tx.gas, 10).toString(16)}`,
            gasPrice: `0x${parseInt(tx.gasPrice,10).toString(16)}`,
            hash: tx.hash,
            nonce: `0x${parseInt(tx.nonce,10).toString(16)}`,
            r: tx.r,
            s: tx.s,
            to: tx.to,
            data:tx.input,
            transactionIndex: `0x${parseInt(tx.transactionIndex,10).toString(16)}`,
            v: tx.v,
            value: `0x${parseInt(tx.value,10).toString(16)}`,
        }

        // reconstruct public key
        const pubKeya = new EthereumTx(txObj, {common}).getSenderPublicKey();
        console.log(pubKeya)

        // reconstruct address to verify correct public key
        const sender = new EthereumTx(txObj, {common}).getSenderAddress();
        console.log(sender.toString("hex"));

        // convert to a compresed pub key to be used in asym encrypt
        const compressedKey = convertToCompressedPublicKey(pubKeya);

        // perform encryption to encode with derived public key
        const ipfsCID = await CryptoManager.mintNewShard(Buffer.from(compressedKey), index, this.web3.currentProvider.selectedAddress);

        console.log(this.recoveryContract.methods);
        // call contract to mint this new recovery nft
        try {

            // const recoveryContract = new this.web3.eth.Contract(RecoveryContract.abi, this.recoveryContractAddress);
            // console.log(recoveryContract.methods.sendShardToShardOwner(address, "QmbSo373odJ8HosMNYgsFGw5bfkKrG5GhkZwJX9KYNL4zu").encodeABI());
            const url = "http://localhost:3005/encodeABI?recoveryContractAddress=" + this.recoveryContractAddress + "&addressTo="+address+"&shardURI="+ipfsCID.path;
            const response = await fetch(url);
            const responseData = await response.json();
            
            const encodedAbi = responseData.abi;

            const count = await this.web3.eth.getTransactionCount(this.web3.currentProvider.selectedAddress);
            this.web3.eth.sendTransaction({
                from: this.web3.currentProvider.selectedAddress,
                nonce: count,
                gasPrice: "0x20",
                gasLimit: "0x100000",
                to: this.recoveryContractAddress,
                value: "0x0",
                data: encodedAbi,
            }, function(err, res){
                if (err){
                    console.log(err); return;
                } 
                console.log("result ", res);
            });
        } catch (e){
            console.log(e);
        }
        
    }


    async recoverAddressPubKey(protectingAddress, protectedAddress){
        const contractAddress = await this.masterRecoveryContract.methods.contractMappings(protectedAddress).call();
        console.log(protectingAddress);
        // check address is verified
        const recoveryContract = new this.web3.eth.Contract(RecoveryContract.abi, contractAddress);
        const isVerified = await recoveryContract.methods.confirmed(protectingAddress).call();
        if (!isVerified) return null;

        console.log(isVerified);
        
        // get the block number in which the confirm took place
        const blockNo = await recoveryContract.methods.confirmedBlockNo(protectingAddress).call();
        const block = await this.web3.eth.getBlock(blockNo);
        const tx = await this.web3.eth.getTransaction(block.transactions[0]);
        
        const common = new Common.forCustomChain(
            "mainnet",
            {
                name:"custom",
                networkId: "0x1691",
                chainId: "0x539",
            },
            "petersburg"
        );
        const EthereumTx = require('ethereumjs-tx').Transaction;
        const txObj = {
            // from: tx.from,
            gas: `0x${parseInt(tx.gas, 10).toString(16)}`,
            gasPrice: `0x${parseInt(tx.gasPrice,10).toString(16)}`,
            hash: tx.hash,
            nonce: `0x${parseInt(tx.nonce,10).toString(16)}`,
            r: tx.r,
            s: tx.s,
            to: tx.to,
            data:tx.input,
            transactionIndex: `0x${parseInt(tx.transactionIndex,10).toString(16)}`,
            v: tx.v,
            value: `0x${parseInt(tx.value,10).toString(16)}`,
        }

        // reconstruct public key
        const pubKeya = new EthereumTx(txObj, {common}).getSenderPublicKey();
        return pubKeya;
    }


    /**Retrieve the NFTs owned by an account
     * 
     * This method will likely be run in isolation, so the correct contract address must be requested manually
     * 
     * @param {String} address - the address of the account being protected
     * @param {String} from - the address of the account checking balances
     */
    async getNFTsForAddress(address, from){
        // get user's recovery contract address
        const contractAddress = await this.masterRecoveryContract.methods.contractMappings(address).call();
        console.log("contract address ", contractAddress);
        const recoveryInstance = await new this.web3.eth.Contract(RecoveryContract.abi, contractAddress);
        const nftContractAddress = await recoveryInstance.methods.getNFTAddress().call(); 
        const shardNFTInstance = await new this.web3.eth.Contract(NFTContract.abi, nftContractAddress);
        console.log("nft contract address ", nftContractAddress);

        // check the NFTs in balance for an account
        const balances = await shardNFTInstance.methods.balanceOf(from).call();
        console.log("balances ", balances);

        // if balances is greater than 0, then request a the ids of all of user's nfts, guard clause
        if (balances < 1) return null;
        
        const tokenIds = await shardNFTInstance.methods.tokensOfOwner(from).call();
        console.log(tokenIds);
        // Request the IPFS URIs of the shard resources
        var shardCIDs = {};
        for (let i = 0; i< tokenIds.length; i++){
            var cid = await shardNFTInstance.methods.tokenURI(new BN(parseInt(tokenIds[i]))).call();
            shardCIDs[tokenIds[i]] = cid;
        }

        console.log(shardCIDs);
        return shardCIDs;
    }

    /**Trigger Recovery Event
     * 
     * Sends a recovery NFT to each of the user's who are trustees
     * 
     * @param {String} reason 
     */
    async triggerRecoveryEvent(reason, addressToProtect){
        // get user's recovery contract address
        const contractAddress = await this.masterRecoveryContract.methods.contractMappings(addressToProtect).call();
        console.log("contract address ", contractAddress);
        const recoveryInstance = await new this.web3.eth.Contract(RecoveryContract.abi, contractAddress);

        const senderPubKey = await this.recoverAddressPubKey(this.web3.currentProvider.selectedAddress, addressToProtect);
        if (senderPubKey === null) return alert("triggering recovery failed");

        const metadata = {
            "name": `${reason} Recovery Notification`,
            "description": `Share to protect ${addressToProtect}`,
            "sender": this.web3.currentProvider.selectedAddress,
            "senderPubKey": senderPubKey
        };

        // upload this metadata to IPFS
        const cid = await CASManager.addFileToIpds(JSON.stringify(metadata));
        console.log("cid " ,cid);
        

        // call contract to mint this new recovery nft
        try {

            // const recoveryContract = new this.web3.eth.Contract(RecoveryContract.abi, this.recoveryContractAddress);
            // console.log(recoveryContract.methods.sendShardToShardOwner(address, "QmbSo373odJ8HosMNYgsFGw5bfkKrG5GhkZwJX9KYNL4zu").encodeABI());
            const url = "http://localhost:3005/encodeABItriggerRecovery?recoveryContractAddress=" + contractAddress + "&shardURI="+cid.path;
            const response = await fetch(url);
            const responseData = await response.json();
            
            const encodedAbi = responseData.abi;
            console.log("encoded abi, ", encodedAbi)

            // send the raw abi
            const count = await this.web3.eth.getTransactionCount(this.web3.currentProvider.selectedAddress);
            this.web3.eth.sendTransaction({
                from: this.web3.currentProvider.selectedAddress,
                nonce: count,
                gasPrice: "0x20",
                gasLimit: "0x100000",
                to: contractAddress,
                value: "0x0",
                data: encodedAbi,
            }, function(err, res){
                if (err){
                    console.log(err); return;
                } 
                console.log("result ", res);
            });
        } catch (e){
            console.log(e);
        }
        
    }

    /**This message will send your recovery shard to the user who initialised recovery
     * allowing them to reconstruct the original secret
     * 
     * - Get the public key of the user who triggered recovery,
     * - Decrypt the user's recovery NFT
     * - Re-mint a new recoery NFT owned by the person who triggered recovery
     * - It will end up in their wallet to view and reconstruct the secret
     */
    async sendRecoveryShard(privKey, addressToProtect, alertObject, recoveryShare){
        // verify the sender public key matches the address of the user who initiliased recovery
        const contractAddress = await this.masterRecoveryContract.methods.contractMappings(addressToProtect).call();
        console.log("contract address ", contractAddress);
        const recoveryInstance = await new this.web3.eth.Contract(RecoveryContract.abi, contractAddress);
        const addressThatInitialisedRecovery = await recoveryInstance.methods.viewWhoTriggeredRecovery().call();

        // reconstruct the public key to verify they are the sender 
        const senderPubkey = convertToCompressedPublicKey(Buffer.from(alertObject["senderPubKey"]));
        console.log("Sender pub key from response obj, ", senderPubkey);
        const address = publicKeyToAddress(Buffer.from(senderPubkey));
        console.log("Address from contract, ", addressThatInitialisedRecovery);
        console.log("Address from pub key, ", address );
        
        // guard clause if the recovered address does not match that which triggered recovery
        if (addressThatInitialisedRecovery !== address) return alert("Security issue, cannot trigger recovery");

        // unencrypt the recovery share
        const unencryptedShare = await CryptoManager.assymetricDecrypt(privKey, recoveryShare.data);

        // reencrypt the share with the new senders address
        const newEncryptedShare = await CryptoManager.assymetricEncrypt(senderPubkey, unencryptedShare);

        // create a new NFT object and add to ipfs
        const nftRecoveryResponse = {
            "name": "Recovery Response",
            "description": `Recovery Response ${addressToProtect}`,
            "sender": this.web3.currentProvider.selectedAddress,
            "data": newEncryptedShare
        };

        const cid = await CASManager.addFileToIpds(JSON.stringify(nftRecoveryResponse));

        // call contract to make recovery response
        try {

            // const recoveryContract = new this.web3.eth.Contract(RecoveryContract.abi, this.recoveryContractAddress);
            // console.log(recoveryContract.methods.sendShardToShardOwner(address, "QmbSo373odJ8HosMNYgsFGw5bfkKrG5GhkZwJX9KYNL4zu").encodeABI());
            const url = "http://localhost:3005/encodeABIRespondRecovery?recoveryContractAddress=" + contractAddress + "&shardURI="+cid.path;
            const response = await fetch(url);
            const responseData = await response.json();
            
            const encodedAbi = responseData.abi;
            console.log("encoded abi, ", encodedAbi)

            // send the raw abi
            const count = await this.web3.eth.getTransactionCount(this.web3.currentProvider.selectedAddress);
            this.web3.eth.sendTransaction({
                from: this.web3.currentProvider.selectedAddress,
                nonce: count,
                gasPrice: "0x20",
                gasLimit: "0x100000",
                to: contractAddress,
                value: "0x0",
                data: encodedAbi,
            }, function(err, res){
                if (err){
                    console.log(err); return;
                } 
                console.log("result ", res);
                alert("Recovery shard sent")
            });
        } catch (e){
            console.log(e);
        }
    }

    /**Recombine Recovery Secrets
     * 
     * Takes all of the fetched shards from IPFS and recombines them into the seed phrase
     * 
     * @param {Object[]} recoverySecrets 
     * @param {String} privatekey 
     * @returns {String} recoveredSecret 
     */
    async recombineRecoverySecrets(recoverySecrets, privatekey){
        
        var decryptedSecrets=[];
        for (let i =0; i< recoverySecrets.length; i++){
            const decrepytedShare = await cryptoManager.assymetricDecrypt(privatekey, recoverySecrets[i].data);
            console.log(JSON.parse(JSON.parse(decrepytedShare)));
            decryptedSecrets.push(JSON.parse(JSON.parse(JSON.parse(decrepytedShare))));
        }
        console.log(decryptedSecrets);
        // recombine the shares
        const justShares = decryptedSecrets.map(secret => secret.share);
        console.log(justShares);
        return cryptoManager.recombineForSecret(justShares);
    }


}

const recoveryContractManager = new RecoveryContractManager();
export default recoveryContractManager;


function convertToCompressedPublicKey(longPubKey){
    var hexKey = uint8ArrayToHex(longPubKey);
    hexKey = "04" + hexKey;
    const arrKey = Buffer.from(hexKey, "hex");
    const compressedKey = _secp256k.publicKeyConvert(arrKey, true);
    console.log(compressedKey);
    console.log(uint8ArrayToHex(compressedKey));
    return compressedKey;
}

function uint8ArrayToHex(arr) {
    return Buffer.from(arr).toString('hex');
}

function hexToUnit8Array(str) {
    return new Uint8Array(Buffer.from(str, 'hex'));
}


/**
 * / const EthereumTx = require('ethereumjs-tx').Transaction;
        // const testArr = {
        //     blockHash: "0xd056a0fac74a3e978360ac626280b51867cbb6f6ea8061f01a6b8d5c204e1821",
        //     blockNumber: `0x${tx.blockNumber.toString(16)}`,
        //     from: "0x21f754eF0aDb6279b03d2a2821a8FA667779FE06",
        //     gas: `0x${tx.gas.toString(16)}`,
        //     gasPrice: `0x${tx.gasPrice.toString(16)}`,
        //     hash: "0xaf1202460394cd45aff4dca2c9446dc8cf9e11e573f3ffc6282853a35270f52f",
        //     input: "0xdd70b55c",
        //     nonce: `0x${tx.nonce.toString(16)}`,
        //     r: "0xb2f63d1ff1909362de8abaefa5f3ff10de377c085072939bb8373a8203c0d80d",
        //     s: "0x75fc8d4ca7cfe7873130165a5a7ef3749c6a430ab400d00854078ac7dbe59185",
        //     to: "0x1779398c44D58fd85f7E8BbDeA75d0de322617a0",
        //     transactionIndex: `0z${tx.transactionIndex.toString(16)}`,
        //     v: "0x0",
        //     value: "0x0",
        //     chainId: 1337
        // }
        // const pubKeya = new EthereumTx(testArr).getSenderPublicKey();
        // console.log(pubKeya)
        // const sender = new EthereumTx(testArr).getSenderAddress();
        // console.log(sender);


            
        const pubKey = ecrecover(prefixed, parseInt(tx.v), r, s, 1337);
        // const pubKey = ecrecover(prefixedMessage, 27, r, s);
        console.log(pubKey.length);
        const hub = pubToAddress(pubKey,true);
        console.log(hub.toString("hex"));
 */