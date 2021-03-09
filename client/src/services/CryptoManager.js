import ElementLib from '@transmute/element-lib'
import { bip39 } from '@transmute/element-lib/src/crypto';
import { toEthereumAddress } from 'did-jwt';
import Crypto from "crypto";

import {hdkey} from "ethereumjs-wallet";
import { encrypt } from '@textile/hub';
import eccrypto from "eccrypto";
import fs from "fs";


class CryptoManager {

    constructor(){
        this.generateMnemomic = this.generateMnemomic.bind(this);
    }

    generateMnemomic(){
        let mnem = ElementLib.MnemonicKeySystem.generateMnemonic();
        return mnem;
    }

    /**Get Buffer at index
     * 
     * Gets the private key bytes at a particular hdkey index
     * 
     * @param {*} mnemonic 
     * @param {*} index 
     */
    async getPublicPrivateKeyAtIndex(mnemonic, index){
        const seed = await bip39.mnemonicToSeed(mnemonic);
        const root = hdkey.fromMasterSeed(seed);
        //NOTE: 60 is specific to eth, check if there is a sidetree unique version
        const hdPath = `m/44'/60'/0'/0/${index}`;
        const addrNode = root.derive(hdPath);
        // return addrNode.privateKey;
        return {
            pubKey: addrNode.publicKey.toString("hex"),
            privKey: addrNode.privateKey.toString("hex")
        };
    }

    /**
     * 
     * @param {*} publicKey 
     */
    async createEthAddressFromPubKey(publicKey){
        return toEthereumAddress(publicKey);
    }


    /**Encrypt File for IPFS
     * 
     * Takes a file that is going to be stored on IPFS, generates an ephemeral key,
     * encrypts it and then passes the file to 
     * @param {File} file
     * @returns {Object} {
     *  encryptedFile,
     *  ephKey
     * } 
     */
    async encryptFileForIPFS(file, isPath){
        // get file if from path or passed as buffer
        var fileData = null;
        console.log(isPath);
        if (isPath){
            fileData = fs.readFileSync(file);
        } else{
            fileData = file;
        }

        // ephemeral key
        const ephKey = Crypto.randomBytes(16).toString("hex");
        const iv = Crypto.randomBytes(8).toString("hex");
        const encryptedFile = this.encryptWithAES(fileData, ephKey, iv);
        // concat buffers for upload
        const encryptedBuffer = Buffer.concat([
            Buffer.from(iv, "utf8"),
            Buffer.from(encryptedFile, "utf8")
        ]);
        
        return {
            encryptedBuffer,
            ephKey
        }
    }

    /**Encrypt with AES
     * 
     * Construct an AES cipher using a given ephemeral key and iv values
     * returns the encrypted buffer in hex format
     * @param {Buffer} buffer 
     * @param {Buffer(String)} ephKey 
     * @param {Buffer(String)} iv 
     */
    encryptWithAES(buffer, ephKey, iv){
        const cipher = Crypto.createCipheriv("aes-256-ctr", ephKey, iv);
        const data = cipher.update(buffer);
        const encrypted = Buffer.concat([data, cipher.final()]);
        return encrypted.toString("hex");
    }

    /**Decrypt Symmetric Buffer
     * 
     * Takes the buffer returned from IPFS and slices it into it's seperate components
     *  - iv 
     *  - file buffer
     * Once seperated, these are used as parameters in a decryption method which is returned
     * 
     * @param {Buffer} buffer 
     * @param {String} ephemeralKey
     * 
     * @returns {Buffer} filePlaintext
     */
    decryptSymmetricBuffer(buffer, ephemeralKey){
        const iv = buffer.slice(0, 16).toString("utf8");
        const content = buffer.slice(16).toString("utf8");
        const contentBuffer = Buffer.from(content, "hex");

        return cryptoManager.decryptWithAES(contentBuffer, ephemeralKey, iv);
    }

    /**Decrypt with AES
     * 
     * Creates an AES cipher using the provided ephemeral key and iv value
     * returns the decrypted version of the provided buffer
     * 
     * @returns {Buffer} decryptedBuffer
     * 
     * @param {Buffer} buffer 
     * @param {Buffer} ephKey 
     * @param {Buffer} iv 
     */
    decryptWithAES(buffer, ephKey, iv){
        const cipher = Crypto.createCipheriv("aes-256-ctr", ephKey, iv);
        const data = cipher.update(buffer);
        const decrypted = Buffer.concat([data, cipher.final()]);
        return decrypted;
    }


    async assymetricEncrypt(publicKey, data){
        return await eccrypto.encrypt(Buffer.from(publicKey, "hex"), Buffer.from(data));
    }

    async assymetricDecrypt(privateKey, data){
        // read and parse the encrypted data so that it can be interpreted
        const g = JSON.stringify(data);
        const actualData = JSON.parse(g, (k,v) => {
            return v.type == "Buffer" ? Buffer.from(v.data, "hex") : v
        });
        return (await eccrypto.decrypt(Buffer.from(privateKey, "hex"), actualData)).toString();
    }


}
const cryptoManager = new CryptoManager();
export default cryptoManager;