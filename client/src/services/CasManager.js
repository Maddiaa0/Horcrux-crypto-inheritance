import ipfsClient from 'ipfs-http-client';
import CryptoManager from "./CryptoManager";
import KeyManager from "./KeyManager";

import {Client, Buckets, UserAuth, PrivateKey, Identity} from "@textile/hub";
import { BigNumber, providers, utils } from 'ethers'
import { hashSync } from 'bcryptjs'
import { keys } from '@material-ui/core/styles/createBreakpoints';
import cryptoManager from './CryptoManager';
import keyManager from './KeyManager';
import eccrypto from "eccrypto";

import local from '../config/local';


const ethUtil = require('ethereumjs-util')

const TEXTILE_KEY_OBJECT = {
    key: "bcty2t3xgzbvq26h4wyy7u4rhwa"
};

class CasManager {

    /**
     * Initialise and connect to an ipfs instance, in this case we will connect to a 
     * local node
     */
    constructor(){
        const ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' });
        this.ipfs = ipfs;
        this.userIdentity = null;
    }

    /**
     * Checks if a local ipfs instance has been initilaised
     */
    checkIpfsInitialised(){
        return this.ipfs !== null;
    }

    /**Publish the provided ipfs address to ipns
     * 
     * @param {String} _ipfsAddr 
     */
    publishToIpns(_ipfsAddr){
        this.ipfs.name.publish(_ipfsAddr).then(function (res) {
            // You now receive a res which contains two fields:
            //   - name: the name under which the content was published.
            //   - value: the "real" address to which Name points.
            console.log(`https://gateway.ipfs.io/ipns/${res.name}`)
          })
    }


    async addFileToIpds(_file){
        const CID = await this.ipfs.add(_file);
        return CID;
    }

    async getFileFromCID(_cid){
        const file = await this.ipfs.get(_cid);
        return file;
    }



    /**
     * Create a new IPNS keypair 
     */
    async createNewIPNSKeyPair(){
        const key = await this.ipfs.key.gen("user-key", {
            type:"rsa",
            size: "2048"
        });
        return key;
    }

    /**
     * Returns a pem encoded key that can be added to the eth blockchain for storage
     * @param {String} password 
     */
    async exportKeyToAddToChain(password){
        const pemFile = await this.ipfs.key.export("user-key", password);
        return pemFile;
    }


    /**
     * ping where the decentralised identity ipfs service endpoitn points to to 
     * ensure that the user's databucket is infact stored there
     */
    pingIpnsBucketInstance(){
        //TODO
    }

    // everything below here will be done using textile buckets!!!
    async getOrCreateBucket(auth, bucketName){
        const buckets = Buckets.withUserAuth(auth);
        const {root, threadID} = await buckets.getOrCreate(bucketName);
        if (!root) throw Error("Bucket has not been created");
        const bucketKey = root.key;
        return {buckets, bucketKey};
    }

    /**
     * Run whenever the user is at the storage root, in order to get the ipfs hash of their textile bucket
     */
    async initTextileForUser(){
        const keys = KeyManager.getKeysFromStorage("password");
        const addr = ethUtil.privateToAddress(`0x${keys.privKey}`);
        const _ethAddress = `0x${addr.toString("hex")}`;
        console.log(_ethAddress);

        // get the users identity from storage or create a new one using metamask and their address and private key as entropy
        const storedId = await this.getUserIdentityFromStorage();
        if (storedId !== undefined && storedId !== null){
            this.userIdentity = PrivateKey.fromString(storedId);
        } else {
            await this.generatePrivateKey(_ethAddress);
        }

        // set up the the client
        const client = await this.authorizeDev();
        const returned = await this.setUpUserBuckets();
        console.log(returned);
    }

    // async getIdentity(){
    //     const privKey =  KeyManager.privateKey;
    //     if (privKey == null){
    //         throw new Error("User identity has not been initialised");
    //     }
    //     this.userIdentity = PrivateKey.fromString(privKey);
    //     PrivateKey.
    // }

    
    async signMessage(message){
        if (this.userIdentity == null){
            throw new Error("User Identity is not defined");
        }

        const mes = Buffer.from(message);
        const cred = this.userIdentity.sign(mes);
        return cred;
    }

    /**Authorize Dev - get client
     * 
     * Returns a textile client object that has the current user signed in?
     */
    async authorizeDev(){
        if (this.userIdentity == null){
            throw new Error("User Identity is not defined");
        }

        const client = await Client.withKeyInfo(TEXTILE_KEY_OBJECT);
        await client.getToken(this.userIdentity);
        return client;
    }


    async setUpUserBuckets(){
        const buckets = await Buckets.withKeyInfo(TEXTILE_KEY_OBJECT);
        await buckets.getToken(this.userIdentity);

        const bucketResult = await buckets.getOrCreate(KeyManager.publicKey);
        console.log(bucketResult);
        if (!bucketResult.root){
            throw new Error("Failed to open buckets");
        }
        return {
            buckets: buckets,
            bucketKey: bucketResult.root.key
        };
    }



    generateMessageForEntropy(ethereum_address, application_name, secret) {
        return (
          '******************************************************************************** \n' +
          'READ THIS MESSAGE CAREFULLY. \n' +
          'DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND WRITE \n' +
          'ACCESS TO THIS APPLICATION. \n' +
          'DO NOT SIGN THIS MESSAGE IF THE FOLLOWING IS NOT TRUE OR YOU DO NOT CONSENT \n' +
          'TO THE CURRENT APPLICATION HAVING ACCESS TO THE FOLLOWING APPLICATION. \n' +
          '******************************************************************************** \n' +
          'The Ethereum address used by this application is: \n' +
          '\n' +
          ethereum_address +
          '\n' +
          '\n' +
          '\n' +
          'By signing this message, you authorize the current application to use the \n' +
          'following app associated with the above address: \n' +
          '\n' +
          application_name +
          '\n' +
          '\n' +
          '\n' +
          'The hash of your non-recoverable, private, non-persisted password or secret \n' +
          'phrase is: \n' +
          '\n' +
          secret +
          '\n' +
          '\n' +
          '\n' +
          '******************************************************************************** \n' +
          'ONLY SIGN THIS MESSAGE IF YOU CONSENT TO THE CURRENT PAGE ACCESSING THE KEYS \n' +
          'ASSOCIATED WITH THE ABOVE ADDRESS AND APPLICATION. \n' +
          'AGAIN, DO NOT SHARE THIS SIGNED MESSAGE WITH ANYONE OR THEY WILL HAVE READ AND \n' +
          'WRITE ACCESS TO THIS APPLICATION. \n' +
          '******************************************************************************** \n'
        );
      }
    
      getSigner = async () => {
        if (!window.ethereum) {
          throw new Error(
            'Ethereum is not connected. Please download Metamask from https://metamask.io/download.html'
          );
        }
    
        console.debug('Initializing web3 provider...');
        // @ts-ignore
        const provider = new providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return signer
      }
    
      async getAddressAndSigner(ethAddress) {
        const signer = await this.getSigner()
        return {address: ethAddress, signer}
      }
      generatePrivateKey = async ethAddress => {
          console.log(ethAddress)
        const metamask = await this.getAddressAndSigner(ethAddress)
        console.log(metamask.address);
        // avoid sending the raw secret by hashing it first
        const secret = hashSync(KeyManager.privateKey, 10)
        const message = this.generateMessageForEntropy(metamask.address, 'user-textile-bucket-key', secret)
        const signedText = await metamask.signer.signMessage(message);
        const hash = utils.keccak256(signedText);
        console.log(hash);
        if (hash === null) {
          throw new Error('No account is provided. Please provide an account to this application.');
        }
        // The following line converts the hash in hex to an array of 32 integers.
       
        const array = hash
          .replace('0x', '')
          .match(/.{2}/g)
          .map((hexNoPrefix) => new ethUtil.BN('0x' + hexNoPrefix).toNumber())
        
        if (array.length !== 32) {
          throw new Error('Hash of signature is not the correct size! Something went wrong!');
        }
        const identity = PrivateKey.fromRawEd25519Seed(Uint8Array.from(array))
        console.log(identity.toString());
        this.storeUserIdentity(identity.toString());
        // Your app can now use this identity for generating a user Mailbox, Threads, Buckets, etc
        this.userIdentity = identity;
        return identity
      }


      async storeUserIdentity(identity){
          if (typeof identity !== "string" && identity == null){
            throw new Error("String identity required");
          }

          localStorage.setItem("identity", identity);
      }

      async getUserIdentityFromStorage(){
        const id = localStorage.getItem("identity");
        return id;
      }


      // add file to ipfs after encrypting
      async addFileToIPFS(textilePath, filePath, fileName){
        // encrypt the file with an ephemeral key  
        // first add the file to ipfs
          // get the hash of the uploaded file
          // add the uploaded file to the given path in textile? - that should do it
        const {encryptedBuffer, ephKey} = CryptoManager.encryptFileForIPFS(filePath);
        
        // add file to ipfs
        const CID = this.addFileToIPFS(encryptedBuffer);

        // Meta Data Object
        const metaData = {
            name: fileName,
            owner: "Ethereum address", //TODO: add ethereum address
            ephKey: ephKey,
            CID: CID
        };

        const keys = await keyManager.getKeysFromStorage("password");
        // asynmetrically encrypt the meta data
        const encrypted = eccrypto.encrypt(keys.pubKey, Buffer.from(JSON.stringify(metaData)));
        const CID = this.addFileToIPFS(encrypted);

        // add the file to textile!!

      }

      // get file from IPFS
      async getFileFromIPFS(metaDataCID){
        // this will return the metadata file
        const encryptedMetadata = this.getFileFromCID(metaDataCID);
        const decryptedMetaData = JSON.parse((await eccrypto.decrypt(encryptedMetadata)).toString());

        // get the full file form IPFS
        const encryptedFile = await thie.getFileFromCID(decryptedMetaData.CID);
        const decryptedFile = CryptoManager.decryptFileFromIPFS(encryptedFile, decryptedMetaData.ephKey);

        return decryptedFile;
      }

}

const CASManager = new CasManager();
export default CASManager;