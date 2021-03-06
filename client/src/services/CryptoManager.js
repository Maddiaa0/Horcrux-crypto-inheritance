import ElementLib from '@transmute/element-lib'
import { bip39 } from '@transmute/element-lib/src/crypto';
import { toEthereumAddress } from 'did-jwt';
import RandomKey from "random-key";
import CryptoJS from "crypto-js";

import {hdkey} from "ethereumjs-wallet";
import { encrypt } from '@textile/hub';


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
    encryptFileForIPFS(path){
        // ephemeral key
        const ephKey = RandomKey.generateBase30(56);
        const fileData = fs.readFileAsync(path);
        const dataBase64  = fileData.toString("base64");
    
        const encryptedFile = CryptoJS.AES.encrypt(dataBase64, ephKey);
        const encryptedBuffer = new Buffer.from(encryptedFile.toString("base64");)
        return {
            encryptedBuffer,
            ephKey
        }
    }


    decryptFileFromIPFS(encryptedFile, ephemeralKey){
        if (encryptedFile == null || ephemeralKey == null){
            throw new Error("Encrypted file and key have no value");
        }
        const decrypted = CryptoJS.AES.decrypt(encryptedFile.toString("base64"), ephemeralKey);
        return decrypted.toString(CryptoJS.enc.Utf8);
    }


}
const cryptoManager = new CryptoManager();
export default cryptoManager;