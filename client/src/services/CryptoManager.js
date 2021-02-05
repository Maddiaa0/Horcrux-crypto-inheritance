import ElementLib from '@transmute/element-lib'
import { bip39, hdkey } from '@transmute/element-lib/src/crypto';
import { toEthereumAddress } from 'did-jwt';


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


}
const cryptoManager = new CryptoManager();
export default cryptoManager;