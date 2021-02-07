import element from '@transmute/element-lib';
import config from '../config';
// import ropsten from '../config/ropsten';


// import { MongoDb } from '@sidetree/db';
import web3 from 'web3';
// import { EthereumLedger } from '@sidetree/ethereum';
// import { IpfsCas } from '@sidetree/cas-ipfs';
// import {Element} from "@sidetree/element"

import EtherDID from "ethr-did";
import { createJWT, verifyJWT, SimpleSigner, toEthereumAddress, Signer } from 'did-jwt';

import {Resolver } from 'did-resolver';
import {getResolver, stringToBytes32 ,delegateTypes} from "ethr-did-resolver" 
// import {getResolver, stringToBytes32, delegateTypes } from "./DidEthResolver";
import getWeb3 from '../getWeb3';
import Web3 from 'web3';

// rpc fix
import HttpProvider from 'ethjs-provider-http'

// registry contract local
import DidRegContract from '../contracts/EthereumDIDRegistry.json'; 

// get registry
const DidRegistryContract = require("ethr-did-registry");







// const { Jwk } = require('@sidetree/core');

class IdentityManager {
    
    constructor(){
        // perform module bindings
        // this.getTestSideTree = this.getTestSideTree.bind(this);
        // this.createDID = this.createDID.bind(this);
        // this.sidetree = null;

        // this.getTestSideTree();


        this.resolver = null;
        console.log(this.sidetree);
    }


    /**Create and sign a local DID
     * 
     * @param {*} ethAdress 
     * @param {*} privateKey 
     */
    async didEtherCreate(ethAdress, privateKey){
        const web3 = getWeb3();
        
        let provider = new HttpProvider('http://localhost:7545');
        let registry = "0x55720605503D1f5E10E7394230a0DE6f85DFAB98";
        // let registry = "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b";
        let address = ethAdress;
        let rpcUrl = "https://ropsten.infura.io/v3/bd43a2a9349a4c05af34e872b1872563";
        const ethrDid = new EtherDID({provider, registry, address, privateKey})
        return ethrDid;
    }

    async didEtherCreateFromGanache(){
        let provider = new HttpProvider('http://localhost:7545');
        let registry = "0x55720605503D1f5E10E7394230a0DE6f85DFAB98";
        // let registry = "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b";
        let address = "0x834038beEAB27C22d8c59562F765F6915FB2E7Ff";
        let privateKey = "43119a9eb4788a76e212e3ef12237f18f9e533f3e7e65df79381487edcae921c";
        const ethrDid = new EtherDID({provider, registry, address, privateKey})
        return ethrDid;
    }

    async didEtherCreateFromTruffle(web3){
        const deployedNetwork = DidRegContract.networks[5777];
        const instance = new web3.eth.Contract(
            DidRegContract.abi,
            deployedNetwork && deployedNetwork.address,
        );

        // listen for new contract events 

        let provider = new HttpProvider("http://localhost:8545");
        let registry = deployedNetwork.address;
        const accounts = web3.eth.getAccounts();
        let address = "0x21f754ef0adb6279b03d2a2821a8fa667779fe06";
        let privKey = "85a88ad51783099d4a341e71edd320b4548e44bdd499e6ae66678e54af1adc8b";

        const etherDid = new EtherDID({provider, registry, address, privateKey: privKey});
        return etherDid;
    }

    /**
     * 
     * @param {*} web3 
     */
    createDidEtherFromMetaMask(web3){
        const etherDid = new EtherDID({provider: web3.currentProvider, address: web3.eth.defaultAccount});
        return etherDid;
    }

    /**
     * Initialise a resolver to work from a locally created DID address
     */
    async initLocalResolver(){
        const providerConfig = { 
            rpcUrl: "http://localhost:7545", 
            registry: "0x55720605503D1f5E10E7394230a0DE6f85DFAB98" 
        }
        this.resolver = new Resolver(
            getResolver(providerConfig
        ));
    }
    
    /**
     * Initialise a resolver running off of the truffle development chain
     * @param {String} registryContractAddress 
     */
    async initTruffleResolver(registryContractAddress){
        const providerConfig = {
            rpcUrl: "http://localhost:8545",
            registry: registryContractAddress
        }
        this.resolver = new Resolver(
            getResolver(providerConfig)
        );
    }

    // TODO: set this up to work with ropsten
    async initResolver(didReg, web3){
        const providerConfig = { 
            rpcUrl: "http://localhost:7545", 
            registry: "0x55720605503D1f5E10E7394230a0DE6f85DFAB98" 
        }
        this.resolver = new Resolver(
            getResolver(providerConfig
                // {
        //         //registry: didReg,
        //         // provider: web3.currentProvider
        //     // registry: "0x55720605503D1f5E10E7394230a0DE6f85DFAB98",
        // }
        ));
    }
    
    async resolveDid(did){
        // make sure the resolver is initialised
        if (this.resolver == null){
            throw new Error("Resolver has not yet been initialised")
        }
        return await this.resolver.resolve(did);
    }

    attributeToHex (key, value) {
        if (Buffer.isBuffer(value)) {
            return `0x${value.toString('hex')}`
        }
        const match = key.match(/^did\/(pub|auth|svc)\/(\w+)(\/(\w+))?(\/(\w+))?$/)
        if (match) {
            const encoding = match[6]
            // TODO add support for base58
            if (encoding === 'base64') {
            return `0x${Buffer.from(value, 'base64').toString('hex')}`
            }
        }
        if (value.match(/^0x[0-9a-fA-F]*$/)) {
            return value
        }
        return `0x${Buffer.from(value).toString('hex')}`
    }

    async addIPNSEndpointToDid(etherDidInstance){
        const serviceEndpointName = "did/src/CryptoVault";
        const serviceEndpoint = "asd"; //todo: work out how to create presigned endpoints here

        const bytes = stringToBytes32(serviceEndpointName);
        const encoded = this.attributeToHex(serviceEndpointName, serviceEndpoint);

        console.log("bytes, endcoded");
        console.log(bytes);
        console.log(encoded);

        await etherDidInstance.setAttribute(serviceEndpointName, serviceEndpoint, 100000000);
    }












    // async setUpOtherElem(){
    //     // Configure ledger and ipfs
    //     const getTestLedger = async () => {
    //         const web3 = new Web3(config.ethereumRpcUrl);
    //         const ledger = new EthereumLedger(web3, config.elementAnchorContract);
    //         return ledger;
    //       };
          
    //     const getTestCas = async () => {
    //         const cas = new IpfsCas(
    //             config.contentAddressableStoreServiceUri,
    //         );
    //         return cas;
    //     };

    //     const getTestElement = async () => {
    //         const ledger = await getTestLedger();
    //         const cas = await getTestCas();
            
    //         const element = new Element(config, config.versions, ledger, cas);
    //         await element.initialize(false, false);
    //         element.handleOperationRequest();
    //         return element;
    //     };
    //     return await getTestElement();
    // }

    // createDIDOther = () => {
    //     // get the side tree implementation
    //     const elem = this.setUpOtherElem();

    //     const mks = new element.MnemonicKeySystem(element.MnemonicKeySystem.generateMnemonic());

    //     const mnmomic = element.MnemonicKeySystem.generateMnemonic();
    //     const index = 1;

    //     const [publicKey, privateKey] = Jwk.generateJwkKeyPairFromMnemonic(mnmomic, index);
        
    //     return [publicKey, privateKey];


    // }



    // /**
    //  * TODO: Note that a mnemomic must still be provided for use - this will be taken from web3??
    //  */
    // async getTestSideTree(){
    //     const storage = element.storage.ipfs.configure({
    //         multiaddr: config.ELEMENT_IPFS_MULTIADDR,
    //     });
        
    //     const db = new element.adapters.database.ElementRXDBAdapter({
    //         name: 'element-rxdb.element-app',
    //         adapter: 'browser',
    //     });
        
    //     const storageManager = new element.adapters.storage.StorageManager(db, storage);
        
    //     let blockchain;
        
    //     if (window.web3) {
    //     blockchain = element.blockchain.ethereum.configure({
    //         // META MASK
    //         anchorContractAddress: config.ELEMENT_CONTRACT_ADDRESS,
    //     });
    //     }
        
    //     const parameters = {
    //         maxOperationsPerBatch: 10 * 1000,
    //         batchingIntervalInSeconds: 10,
    //         didMethodName: config.DID_METHOD_NAME,
    //     };
        
    
    //     if (window.web3) {
    //         const sidetree = new element.Sidetree({
    //             blockchain,
    //             storage: storageManager,
    //             db,
    //             parameters,
    //         });
    //         await blockchain.resolving;
    //         this.sidetree = sidetree;
    //     }
    //     return null;
    // }

    // async createDID(mnemomic){
    //     if (this.sidetree !== null){
    //         // Generate a simple did document model
    //         const mks = new element.MnemonicKeySystem(element.MnemonicKeySystem.generateMnemonic());
                    
    //         const primaryKey = await mks.getKeyForPurpose("primary", 0);
    //         const recoveryKey = await mks.getKeyForPurpose("recovery", 0);
    //         const didDocumentModel = this.sidetree.op.getDidDocumentModel(
    //             primaryKey.publicKey,
    //             recoveryKey.publicKey
    //         );

    //         console.log(didDocumentModel);

    //         // Generate Sidetree Create payload
    //         const createPayload = await this.sidetree.op.getCreatePayload(didDocumentModel, primaryKey);

    //         console.log(createPayload);

    //         // Create the Sidetree transaction.
    //         // This can potentially take a few minutes if you're not on a local network
    //         const createTransaction = await this.sidetree.batchScheduler.writeNow(createPayload);
    //         const didUniqueSuffix = this.sidetree.func.getDidUniqueSuffix(createPayload);
    //         const did = `did:elem:ropsten:${didUniqueSuffix}`;
    //         console.log(`${did} was successfully created`);

    //         return {
    //             documentModel: didDocumentModel,
    //             primaryKey: primaryKey,
    //             recoveryKey: recoveryKey,
    //             didUniqueSuffix: `did:elem:ropsten:${didUniqueSuffix}`
    //         };
    //     }
    // }

    // async readDID(didUniqueSuffix){

    //     // Sanity checks
    //     if (didUniqueSuffix == null){
    //         throw new Error("Did unique suffix must have a value");
    //     }
    //     if (typeof didUniqueSuffix !== "string"){
    //         throw new Error("Did unique suffix must be a string");
    //     }

    //     const didDocument = await element.resolve(didUniqueSuffix, true);
    //     console.log(
    //     `${didUniqueSuffix} was successfully resolved into ${JSON.stringify(
    //         didDocument,
    //         null,
    //         2
    //     )}`
    //     );
    // }


    // async deleteDidDocument(didUniqueSuffix, recoveryKey){
    //     // Generate a delete payload this will brick the did forever
    //     const deletePayload = await element.op.getDeletePayload(
    //         didUniqueSuffix,
    //         recoveryKey.privateKey
    //     );
        
    //     // Send Sidetree transaction
    //     const deleteTransaction = await element.batchScheduler.writeNow(deletePayload);
    //     const deletedDidDocument = await element.resolve(didUniqueSuffix, true);
    //     console.log(`${JSON.stringify(deletedDidDocument, null, 2)} was deleted`);
    // }
}

// create singleton
const identityManager = new IdentityManager();
export default identityManager;