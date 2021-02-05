import element from '@transmute/element-lib';
import config from '../config';
// import ropsten from '../config/ropsten';


// import { MongoDb } from '@sidetree/db';
import Web3 from 'web3';
import { EthereumLedger } from '@sidetree/ethereum';
import { IpfsCas } from '@sidetree/cas-ipfs';
import {Element} from "@sidetree/element"


const { Jwk } = require('@sidetree/core');


class IdentityManager {
    
    constructor(){
        // perform module bindings
        // this.getTestSideTree = this.getTestSideTree.bind(this);
        // this.createDID = this.createDID.bind(this);
        // this.sidetree = null;

        // this.getTestSideTree();

        console.log(this.sidetree);
    }

    async setUpOtherElem(){
        // Configure ledger and ipfs
        const getTestLedger = async () => {
            const web3 = new Web3(config.ethereumRpcUrl);
            const ledger = new EthereumLedger(web3, config.elementAnchorContract);
            return ledger;
          };
          
        const getTestCas = async () => {
            const cas = new IpfsCas(
                config.contentAddressableStoreServiceUri,
            );
            return cas;
        };

        const getTestElement = async () => {
            const ledger = await getTestLedger();
            const cas = await getTestCas();
            
            const element = new Element(config, config.versions, ledger, cas);
            await element.initialize(false, false);
            element.handleOperationRequest();
            return element;
        };
        return await getTestElement();
    }

    async createDidWallet(){
        
    }








    // async createDIDOther(){
    //     // get the side tree implementation
    //     // const elem = this.setUpOtherElem();

    //     const mks = new element.MnemonicKeySystem(element.MnemonicKeySystem.generateMnemonic());

    //     const mnmomic = element.MnemonicKeySystem.generateMnemonic();
    //     const index = 1;

    //     // try and generate a key pair and see what happens!



    //     Jwk.generateJwkKeyPairFromMnemonic("secp256k1", mnmomic, index).then(
    //         res => {
    //             console.log(res);
    //         }
    //     ).catch(
    //         err => {
    //             console.log(err);
    //         }
    //     );
    // }



    // // /**
    // //  * TODO: Note that a mnemomic must still be provided for use - this will be taken from web3??
    // //  */
    // // async getTestSideTree(){
    // //     const storage = element.storage.ipfs.configure({
    // //         multiaddr: config.ELEMENT_IPFS_MULTIADDR,
    // //     });
        
    // //     const db = new element.adapters.database.ElementRXDBAdapter({
    // //         name: 'element-rxdb.element-app',
    // //         adapter: 'browser',
    // //     });
        
    // //     const storageManager = new element.adapters.storage.StorageManager(db, storage);
        
    // //     let blockchain;
        
    // //     if (window.web3) {
    // //     blockchain = element.blockchain.ethereum.configure({
    // //         // META MASK
    // //         anchorContractAddress: config.ELEMENT_CONTRACT_ADDRESS,
    // //     });
    // //     }
        
    // //     const parameters = {
    // //         maxOperationsPerBatch: 10 * 1000,
    // //         batchingIntervalInSeconds: 10,
    // //         didMethodName: config.DID_METHOD_NAME,
    // //     };
        
    
    // //     if (window.web3) {
    // //         const sidetree = new element.Sidetree({
    // //             blockchain,
    // //             storage: storageManager,
    // //             db,
    // //             parameters,
    // //         });
    // //         await blockchain.resolving;
    // //         this.sidetree = sidetree;
    // //     }
    // //     return null;
    // // }

    // // async createDID(mnemomic){
    // //     if (this.sidetree !== null){
    // //         // Generate a simple did document model
    // //         const mks = new element.MnemonicKeySystem(element.MnemonicKeySystem.generateMnemonic());
                    
    // //         const primaryKey = await mks.getKeyForPurpose("primary", 0);
    // //         const recoveryKey = await mks.getKeyForPurpose("recovery", 0);
    // //         const didDocumentModel = this.sidetree.op.getDidDocumentModel(
    // //             primaryKey.publicKey,
    // //             recoveryKey.publicKey
    // //         );

    // //         console.log(didDocumentModel);

    // //         // Generate Sidetree Create payload
    // //         const createPayload = await this.sidetree.op.getCreatePayload(didDocumentModel, primaryKey);

    // //         console.log(createPayload);

    // //         // Create the Sidetree transaction.
    // //         // This can potentially take a few minutes if you're not on a local network
    // //         const createTransaction = await this.sidetree.batchScheduler.writeNow(createPayload);
    // //         const didUniqueSuffix = this.sidetree.func.getDidUniqueSuffix(createPayload);
    // //         const did = `did:elem:ropsten:${didUniqueSuffix}`;
    // //         console.log(`${did} was successfully created`);

    // //         return {
    // //             documentModel: didDocumentModel,
    // //             primaryKey: primaryKey,
    // //             recoveryKey: recoveryKey,
    // //             didUniqueSuffix: `did:elem:ropsten:${didUniqueSuffix}`
    // //         };
    // //     }
    // // }

    // // async readDID(didUniqueSuffix){

    // //     // Sanity checks
    // //     if (didUniqueSuffix == null){
    // //         throw new Error("Did unique suffix must have a value");
    // //     }
    // //     if (typeof didUniqueSuffix !== "string"){
    // //         throw new Error("Did unique suffix must be a string");
    // //     }

    // //     const didDocument = await element.resolve(didUniqueSuffix, true);
    // //     console.log(
    // //     `${didUniqueSuffix} was successfully resolved into ${JSON.stringify(
    // //         didDocument,
    // //         null,
    // //         2
    // //     )}`
    // //     );
    // // }


    // // async deleteDidDocument(didUniqueSuffix, recoveryKey){
    // //     // Generate a delete payload this will brick the did forever
    // //     const deletePayload = await element.op.getDeletePayload(
    // //         didUniqueSuffix,
    // //         recoveryKey.privateKey
    // //     );
        
    // //     // Send Sidetree transaction
    // //     const deleteTransaction = await element.batchScheduler.writeNow(deletePayload);
    // //     const deletedDidDocument = await element.resolve(didUniqueSuffix, true);
    // //     console.log(`${JSON.stringify(deletedDidDocument, null, 2)} was deleted`);
    // // }
}

// create singleton
const identityManager = new IdentityManager();
export default identityManager;