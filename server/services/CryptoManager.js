import ElementLib from '@transmute/element-lib';
import { bip39, hdkey, ed25519 } from '@transmute/element-lib/src/crypto';
import crypto from 'crypto';

import ed from "@stablelib/ed25519";

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
            pubKey: addrNode.publicKey,
            privKey: addrNode.publicKey
        };
    }

    // async generateEd25519KeyPairFromMnemonic(mnenonic, index){
    //     const privKeyBuff = await this.getPrivateKeyBufferAtIndex(mnenonic, index);
    //     const keyPair = ed.generateKeyPairFromSeed(privKeyBuff);

    //     console.log(keyPair);

    //     const edKeyPair = await 
    // }

}
const cryptoManager = new CryptoManager();
export default cryptoManager;