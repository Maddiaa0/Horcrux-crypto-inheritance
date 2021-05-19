import ipfsClient from 'ipfs-http-client';
import CryptoManager from "./CryptoManager";
import KeyManager from "./KeyManager";

import {Client, Buckets, UserAuth, PrivateKey, Identity} from "@textile/hub";
import { Context } from '@textile/context'
// import { providers, utils } from 'ethers'
import cryptoManager from './CryptoManager';
import keyManager from './KeyManager';
import eccrypto from "eccrypto";
import axios from "axios";
import { hashSync } from 'bcryptjs'


import GetWeb3 from "../getWeb3";
import local from '../config/local';
const ethUtil = require('ethereumjs-util')


const TEXTILE_KEY_OBJECT = {
    key: "bcty2t3xgzbvq26h4wyy7u4rhwa"
    // key: "b4pepz3xhdkekhkypr2scsieuxu"
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
        this.userBucketInfo = null;
        this.accessGroups = [
          {
              "name": "family",
              "index": 2
          },
          {
              "name": "lawyer",
              "index": 3
          },
          {
            "name": "Caroline",
            "index": 4
          }
      ];

        // method binding
        this.storeUserIdentity = this.storeUserIdentity.bind(this);
        this.addFileToIPFSandTextile = this.addFileToIPFSandTextile.bind(this);
        this.addFileToIpds = this.addFileToIpds.bind(this);
        this.authorizeDev = this.authorizeDev.bind(this);
        this.checkIpfsInitialised = this.checkIpfsInitialised.bind(this);
        this.getFileFromCID = this.getFileFromCID.bind(this);
        this.generatePrivateKey = this.generatePrivateKey.bind(this);
        this.getOrCreateBucket = this.getOrCreateBucket.bind(this);
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
        const file = Buffer.from(_file);
        const CID = await this.ipfs.add(file);
        return CID;
    }

    async getFileFromCID(_cid){
      const res = await axios.get(`http://localhost:8080/ipfs/${_cid}`);
      if (res.status === 200){
        console.log(res.data);
        return res.data;
      } else {
        return null;
      }
    }

    async getBufferFromCID(_cid){
      let file = [];
      for await (const file of this.ipfs.get(_cid)){
        for await (const chunk of file.content){
          file.append(chunk);
        }
      }

      // get the file buffer from ipfs
      file = file.concat(file);
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
     * TODO? identity has already been created and is stored within the local stiorage. At this moment in time the creation is brokwn due to a failure in the
     * ethers dependancy. All i can do from here is use the curretn vault and not create a new one!
     * 
     */
    async initTextileForUser(){
        // get private key from storage!
        const keys = KeyManager.getKeysFromStorage("password");
        console.log(keys);
        const addr = ethUtil.privateToAddress(Buffer.from(keys.privKey, "hex"));
        const _ethAddress = `0x${addr.toString("hex")}`;
        console.log(_ethAddress);

        // get the users textile identity from storage or create a new one using metamask and their address and private key as entropy
        // if one is stored, then use that one, else require it to be signed by metamask
        const storedId = await this.getUserIdentityFromStorage();
        if (storedId !== undefined && storedId !== null){
            this.userIdentity = PrivateKey.fromString(storedId);
        } else {
            await this.generatePrivateKey(_ethAddress);
        }

        // set up the the client
        // const client = await this.authorizeDev();
        const userBuckets = await this.setUpUserBuckets();
        this.userBucketInfo = userBuckets;
        console.log(userBuckets);

        // return if the userBucket has been initialised successfully
        if (this.userBucketInfo !== null) return true;
        else return false;
        
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

    // /**Authorize Dev - get client
    //  * 
    //  * Returns a textile client object that has the current user signed in?
    //  */
    async authorizeDev(){
        if (this.userIdentity == null){
            throw new Error("User Identity is not defined");
        }
        // const client = await new Client(new Context("http://127.0.0.1:3007"));
        // const await new Buckets()
        const client = await Client.withKeyInfo(TEXTILE_KEY_OBJECT);
        await client.getToken(this.userIdentity);
        return client;
    }


    async setUpUserBuckets(){
        // const buckets = await Buckets.withKeyInfo(TEXTILE_KEY_OBJECT);
        const buckets = await new Buckets(new Context("http://127.0.0.1:3007"));
        // await buckets.context.withAPIKey(TEXTILE_KEY_OBJECT);
        
        await buckets.getToken(this.userIdentity);
        // await buckets.getTokenChallenge(this.userIdentity);

        console.log(this.userIdentity);
        console.log(keyManager.publicKey);
        const bucketResult = await buckets.getOrCreate(KeyManager.publicKey);
        console.log(bucketResult);
        if (!bucketResult.root){
            throw new Error("Failed to open buckets");
        }
        return {
            buckets: buckets,
            bucketKey: bucketResult.root.key,
            userBucket: bucketResult
        };
    }
      
      // ensures that web3 is created and gets the signer
      getSigner = async () => {
        if (!window.ethereum) {
          throw new Error(
            'Ethereum is not connected. Please download Metamask from https://metamask.io/download.html'
          );
        }
    
        console.debug('Initializing web3 provider...');
        const web3 = await GetWeb3();
        return web3;
      }
    
      /** Get address and signer
       * 
       * gets a web3 instance to use as a signer
       * 
       * @param {String} ethAddress 
       * @returns {Object} address and web3 instance
       */
      async getAddressAndSigner(ethAddress) {
        const web3 = await this.getSigner()
        return {address: ethAddress, web3}
      }

      // create a textile key from a signed message from the user
      generatePrivateKey = async ethAddress => {
        console.log(ethAddress)
        const metamask = await this.getAddressAndSigner(ethAddress)
        console.log(metamask.address);

        // avoid sending the raw secret by hashing it first
        const secret = hashSync(KeyManager.privateKey, 10)
        
        const msgParams = [
          {
            type: 'string',
            name: 'Message',
            value: 'Sign to create / allow this browser to access your crypto vault'
          },
          {
            type: 'string',
            name: 'From the address',
            value: metamask.address
          },
          {
            type: "string",
            name: "With this seed",
            value: secret
          }
        ]
      
        var from = metamask.web3.currentProvider.selectedAddress
        var params = [msgParams, from]
        var method = 'eth_signTypedData'
      
        return await metamask.web3.currentProvider.send({
          method,
          params,
          from,
        },  (err, result) => {

          if (err) throw new Error("Sig failed");
          
          console.log(result.result);
          const hash = ethUtil.keccak256(Buffer.from(result.result, "hex"));
          console.log(hash);
          // check a valid hash is produced
          if (hash === null) {
            throw new Error('No account is provided. Please provide an account to this application.');
          }
          
          if (hash.length !== 32) {
            throw new Error('Hash of signature is not the correct size! Something went wrong!');
          }
          const identity = PrivateKey.fromRawEd25519Seed(Uint8Array.from(hash))
          console.log(identity.toString());
          this.storeUserIdentity(identity.toString());

          // Your app can now use this identity for generating a user Mailbox, Threads, Buckets, etc
          this.userIdentity = identity;
          return identity
    
        });
        
      }

      /**Store User Identity
       * 
       * Stores the identity of the created textile bucket to local storage, so it can be easily be fetched again
       * 
       * @param {String} identity 
       */
      async storeUserIdentity(identity){
          if (typeof identity !== "string" && identity == null){
            throw new Error("String identity required");
          }

          localStorage.setItem("identity", identity);
      }

      /**Get User Identity from storage
       * 
       * Returns the string representation of the user's textile identity
       * 
       * @returns {String} id
       */
      async getUserIdentityFromStorage(){
        const id = localStorage.getItem("identity");
        return id;
      }


      /**Add File To IPFS
       * 
       * This method performs a number of steps
       * 1. Encrypts file 
       * 2. Uploads to IPFS
       * 3. Creates metadata object pointing to that file
       * 4. Asymmetrically encrypts metadata file
       * 5. Returns CID pointing to that metadata file
       * 
       * @returns {String} CID of the uploaded metadata file
       * 
       * @param {String} textilePath 
       * @param {Buffer | String} fileBuffer 
       * @param {String} fileName 
       * @param {boolean} isPath 
       * @param {Number} accessGroupNumber
       */
      async addFileToIPFSandTextile(textilePath, fileBuffer, fileName, isPath, accessGroupNumber){
        // encrypt the file with an ephemeral key  
        // first add the file to ipfs
          // get the hash of the uploaded file
          // add the uploaded file to the given path in textile? - that should do it        
        const {encryptedBuffer, ephKey} = await CryptoManager.encryptFileForIPFS(fileBuffer, isPath);

        // add file to ipfs
        const CID = await this.addFileToIpds(encryptedBuffer);
        console.log(CID);

        // Meta Data Object
        const metaData = {
            name: fileName,
            owner: "Ethereum address", //TODO: add ethereum address
            ephKey: ephKey,
            CID: CID.path
        };

        // using the provided accessGroupNumber, generate the correct BIP32 key pair to perform encryption with
        const encryptionKey = await keyManager.getAccessGroupKey(accessGroupNumber);
        console.log(encryptionKey);

        // // asynmetrically encrypt the meta data
        const encrypted = await CryptoManager.assymetricEncrypt(encryptionKey.pubKey, metaData);
        const uploadedFileCID = await this.addFileToIpds(JSON.stringify(encrypted));
        console.log(uploadedFileCID.path);

        // add the file to textile!!
        const textileInfo = await this.addtoTextileBucket(textilePath, uploadedFileCID.path, accessGroupNumber);

        return {cid: uploadedFileCID.path, textileInfo};
      }

      /**Add to Textile Bucket
       * 
       * Adds the provided CID from file upload to the provided textile path 
       * 
       * @param {Sting} path 
       * @param {String} cid 
       * @param {String} accessGroupNumber
       * @returns 
       */
      async addtoTextileBucket(path, cid, accessGroupNumber){
        if (!this.userBucketInfo) throw new Error("No bucket provided");

        const buckets = this.userBucketInfo.buckets;
        const textileObject = Buffer.from(JSON.stringify({
          path,
          cid,
          accessGroupNumber
        }));
        return await buckets.pushPath(this.userBucketInfo.bucketKey, path, textileObject);
      }

      /**Get files in Path
       * 
       * @param {String} path 
       * @returns buckets
       */
      async getFilesInPath(path){
        if (!this.userBucketInfo) throw new Error("No bucket provided yet");

        const bucket = this.userBucketInfo.buckets;
        const key = this.userBucketInfo.bucketKey;
        return await bucket.listPath(key, path, 2);
        // return await bucket.listPath(key, path);
      }


      /**Get File from IPFS
       * 
       * Takes the CID of the metadata file which contains an asymmetrically encrypred json object
       * containing the real objects location and the ephemeral encryption key.
       * This method
       * 1. Retreives metadata file
       * 2. Decrypts with the currently logged in user's keys
       * 3. Fetches the real file 
       * 4. Decrypts and returns the real file
       * 
       * @returns {Buffer} DecryptedFile
       * 
       * @param {String} metaDataCID 
       * @param {Number} accessGroupNumber
       */
      async getFileFromIPFS(metaDataCID, accessGroupNumber){
        // this will return the metadata file
        const keys = await keyManager.getAccessGroupKey(accessGroupNumber);
        console.log(keys);
        const encryptedMetadata = await this.getFileFromCID(metaDataCID);
        
        const asUINTs = {
          ciphertext: Buffer.from(encryptedMetadata.ciphertext),
          ephemPublicKey: Buffer.from(encryptedMetadata.ephemPublicKey),
          iv: Buffer.from(encryptedMetadata.iv),
          mac: Buffer.from(encryptedMetadata.mac)
        }
        console.log(asUINTs);

        const decryptedMetaData = JSON.parse(await CryptoManager.asymDecryptFiles(keys.privKey, asUINTs));
        console.log(decryptedMetaData);

        // get the full file form IPFS
        const fileBuffer = Buffer.from(await this.getFileFromCID(decryptedMetaData.CID));
        const decryptedBuffer = CryptoManager.decryptSymmetricBuffer(fileBuffer, decryptedMetaData.ephKey);
        console.log(decryptedBuffer.toString());
        return decryptedBuffer;
      }

      /**Remove File
       * 
       * Removes teh file with the given path from the user's textile bucket
       * 
       * @param {String} path 
       * @returns {boolean} succeeded
       */
      async removeFile(path){
        if (this.userBucketInfo === null || this.userBucketInfo === undefined) throw new Error("No user bucket provided");

        const bucket = this.userBucketInfo.buckets;
        const key = this.userBucketInfo.bucketKey;
        return bucket.removePath(key, path).then(removalResponse => {
          console.log(removalResponse);
          return true;
        }).catch(err => {
          console.log(err);
          return false;
        });
      }

      /**Get Access Groups
       * 
       * Request the accessgroups file found at the root of the textile bucket
       */
      async getAccessGroups(){
        // TODO: FIX AFTER PRES
        // require that buckets be initialised
        // if (this.userBucketInfo === null){
        //   await this.initTextileForUser();
        // }
        // console.log("SUm");
        // const rootPath = await this.getFilesInPath("/");
        // console.log(rootPath);
        
        // if (rootPath.item.items.some(item => item.name === ".accessgroups")){
        //   // access groups exist, request file and read to memory
        //   var buffer = await this.userBucketInfo.buckets.pullPath(this.userBucketInfo.bucketKey, "./accessgroups");
        //   console.log(typeof buffer);
        //   const accessgroups = buffer;
        //   console.log(accessgroups);
        //   this.accessGroups = accessgroups;
        // } 
        // // else{
        // //   // access groups file does not exist, create
        // //   this.userBucketInfo.buckets.pushPath(this.userBucketInfo.bucketKey, "/.accessgroups", Buffer.from(JSON.stringify([])));
        // //   this.accessGroups = {};
        // // }
        return this.accessGroups;
      }

      /**Add Access Group
       * 
       * Adds a new access group for the user
       * 
       * @param {String} groupToAdd 
       */
      async addAccessGroup(groupToAdd){
        // if (this.accessGroups === null) await this.getAccessGroups();
        console.log(this.accessGroups);
        var tempAccessGroup = this.accessGroups;
        // get the current highest index
        
        var max = 0;
        for (let i = 0; i < this.accessGroups.length; i++){
          if (tempAccessGroup[i].index > max) max = tempAccessGroup[i].index;
        }

        // add new access group with a higher number
        tempAccessGroup.push({
          name: groupToAdd,
          index: (max+1)
        });

        // this.userBucketInfo.buckets.pushPath(this.userBucketInfo.bucketKey, "./accessgroups", Buffer.from(JSON.stringify(tempAccessGroup)));
        this.accessGroups = tempAccessGroup;
        console.log(this.accessGroups);
      }

      // test encrypt TODO: REMOVE THeSE AS CLUTTER
      async testEncrypt(){
        console.log("using currently logged in users public key to encrypt");
        // const keys = await keyManager.getKeysFromStorage("password");
        const keys = await keyManager.getAccessGroupKey(2);
        // asynmetrically encrypt the meta data
        const encrypted = await eccrypto.encrypt(Buffer.from(keys.pubKey, "hex"), Buffer.from(JSON.stringify({
          message: "here is the message"
        })));
        console.log(encrypted);
        return encrypted;
      }

      async testDecrypt(encrypted){
        console.log("Using currently logged in users private key to decrypt");
        // const keys = await keyManager.getKeysFromStorage("password");
        const keys = await keyManager.getAccessGroupKey(2);

        const decryptedMetaData = JSON.parse((await eccrypto.decrypt(Buffer.from(keys.privKey, "hex"), encrypted)).toString());
        console.log(decryptedMetaData);
        return decryptedMetaData;
      }


      //test decrypt

}

const CASManager = new CasManager();
export default CASManager;