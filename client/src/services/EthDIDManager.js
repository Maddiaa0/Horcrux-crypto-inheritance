import config from '../config';
import web3 from 'web3';


import EtherDID from "ethr-did";
// import { createJWT, verifyJWT, SimpleSigner, toEthereumAddress, Signer } from 'did-jwt';

import {Resolver } from 'did-resolver';
import {getResolver, stringToBytes32 ,delegateTypes} from "ethr-did-resolver" 
// import {getResolver, stringToBytes32, delegateTypes } from "./DidEthResolver";
import getWeb3 from '../getWeb3';
import Web3 from 'web3';

// rpc fix
import HttpProvider from 'ethjs-provider-http'

// registry contract local
// import DidRegContract from '../contracts/EthereumDIDRegistry.json'; 

// get registry
// const DidRegistryContract = require("ethr-did-registry");

// // The kovan RPC url for my network
// const KOVAN_RPC_URL = "https://kovan.infura.io/v3/bd43a2a9349a4c05af34e872b1872563";
// const KOVAN_ADDR = "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b";

const ETHREG_REMIX_ABI = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "identity",
				"type": "address"
			},
			{
				"name": "delegateType",
				"type": "bytes32"
			},
			{
				"name": "delegate",
				"type": "address"
			},
			{
				"name": "validity",
				"type": "uint256"
			}
		],
		"name": "addDelegate",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "identity",
				"type": "address"
			},
			{
				"name": "sigV",
				"type": "uint8"
			},
			{
				"name": "sigR",
				"type": "bytes32"
			},
			{
				"name": "sigS",
				"type": "bytes32"
			},
			{
				"name": "delegateType",
				"type": "bytes32"
			},
			{
				"name": "delegate",
				"type": "address"
			},
			{
				"name": "validity",
				"type": "uint256"
			}
		],
		"name": "addDelegateSigned",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "identity",
				"type": "address"
			},
			{
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "changeOwner",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "identity",
				"type": "address"
			},
			{
				"name": "sigV",
				"type": "uint8"
			},
			{
				"name": "sigR",
				"type": "bytes32"
			},
			{
				"name": "sigS",
				"type": "bytes32"
			},
			{
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "changeOwnerSigned",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "identity",
				"type": "address"
			},
			{
				"name": "name",
				"type": "bytes32"
			},
			{
				"name": "value",
				"type": "bytes"
			}
		],
		"name": "revokeAttribute",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "identity",
				"type": "address"
			},
			{
				"name": "sigV",
				"type": "uint8"
			},
			{
				"name": "sigR",
				"type": "bytes32"
			},
			{
				"name": "sigS",
				"type": "bytes32"
			},
			{
				"name": "name",
				"type": "bytes32"
			},
			{
				"name": "value",
				"type": "bytes"
			}
		],
		"name": "revokeAttributeSigned",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "identity",
				"type": "address"
			},
			{
				"name": "delegateType",
				"type": "bytes32"
			},
			{
				"name": "delegate",
				"type": "address"
			}
		],
		"name": "revokeDelegate",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "identity",
				"type": "address"
			},
			{
				"name": "sigV",
				"type": "uint8"
			},
			{
				"name": "sigR",
				"type": "bytes32"
			},
			{
				"name": "sigS",
				"type": "bytes32"
			},
			{
				"name": "delegateType",
				"type": "bytes32"
			},
			{
				"name": "delegate",
				"type": "address"
			}
		],
		"name": "revokeDelegateSigned",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "identity",
				"type": "address"
			},
			{
				"name": "name",
				"type": "bytes32"
			},
			{
				"name": "value",
				"type": "bytes"
			},
			{
				"name": "validity",
				"type": "uint256"
			}
		],
		"name": "setAttribute",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "identity",
				"type": "address"
			},
			{
				"name": "sigV",
				"type": "uint8"
			},
			{
				"name": "sigR",
				"type": "bytes32"
			},
			{
				"name": "sigS",
				"type": "bytes32"
			},
			{
				"name": "name",
				"type": "bytes32"
			},
			{
				"name": "value",
				"type": "bytes"
			},
			{
				"name": "validity",
				"type": "uint256"
			}
		],
		"name": "setAttributeSigned",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "identity",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "previousChange",
				"type": "uint256"
			}
		],
		"name": "DIDOwnerChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "identity",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "delegateType",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "delegate",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "validTo",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "previousChange",
				"type": "uint256"
			}
		],
		"name": "DIDDelegateChanged",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "identity",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "name",
				"type": "bytes32"
			},
			{
				"indexed": false,
				"name": "value",
				"type": "bytes"
			},
			{
				"indexed": false,
				"name": "validTo",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "previousChange",
				"type": "uint256"
			}
		],
		"name": "DIDAttributeChanged",
		"type": "event"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "changed",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			},
			{
				"name": "",
				"type": "bytes32"
			},
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "delegates",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "identity",
				"type": "address"
			}
		],
		"name": "identityOwner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "nonce",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"name": "owners",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "identity",
				"type": "address"
			},
			{
				"name": "delegateType",
				"type": "bytes32"
			},
			{
				"name": "delegate",
				"type": "address"
			}
		],
		"name": "validDelegate",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	}
];

const ETHREG_REMIX_ADDRESS = "0x51A8383C9B61C16bC6Ed614E09A340129D8d38Ba";


// const { Jwk } = require('@sidetree/core');

class EthDIDManager {
    
    constructor(){
        this.web3 = null;
        this.resolver = null;
        this.currentUserDid = null;
        this.getWeb();
    }

    async getWeb(){
        this.web3 = await getWeb3();
        //TODO: MOVE away from hardcoding addresses and keys
        // await this.didEtherCreate("0x5e7656a9bca0fd8a90ac870678465754781f8b1c", "3f07fec333030b43aefeb1e6eb1a85ffc732d322f5300639b8770d2354240632");
        await this.createDidEtherFromMetaMask(this.web3);
    }

    /**Create and sign a local DID
     * 
     * @param {*} ethAdress 
     * @param {*} privateKey 
     */
    async didEtherCreate(ethAdress, privateKey){
        
        let provider = new HttpProvider('http://localhost:8545');
        // let registry = "0x55720605503D1f5E10E7394230a0DE6f85DFAB98";
        let registry = ETHREG_REMIX_ADDRESS;
        // let registry = "0xdca7ef03e98e0dc2b855be647c39abe984fcf21b";
        let address = ethAdress;
        // let rpcUrl = "https://ropsten.infura.io/v3/bd43a2a9349a4c05af34e872b1872563";
        const ethrDid = new EtherDID({provider, registry, address, privateKey});
        
        // set the did to the service state
        this.currentUserDid = ethrDid;
        return ethrDid;
    }

    /**
     * 
     * @param {*} web3 
     */
    createDidEtherFromMetaMask(web3){
        const etherDid = new EtherDID({registry: ETHREG_REMIX_ADDRESS, provider: web3.currentProvider, address: web3.currentProvider.selectedAddress});
        console.log("metamask did");
        console.log(etherDid);
        this.currentUserDid = etherDid;
        return etherDid;
    }

    /**
     * Initialise a resolver to work from a locally created DID address
     */
    async initResolver(){
        const providerConfig = { 
            rpcUrl: "http://localhost:8545", 
            registry: ETHREG_REMIX_ADDRESS
        }
        this.resolver = new Resolver(
            getResolver(providerConfig
        ));
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
        const serviceEndpointName = "did/service/CryptoVault";
        const serviceEndpoint = "Qnasddasd7ya54d75sd"; //todo: work out how to create presigned endpoints here

        const bytes = stringToBytes32(serviceEndpointName);
        const encoded = this.attributeToHex(serviceEndpointName, serviceEndpoint);

        console.log("bytes, endcoded");
        console.log(bytes);
        console.log(encoded);

        await etherDidInstance.setAttribute(serviceEndpointName, serviceEndpoint, 100000000);
        return true;
    }


    async addDelegate(etherDidInsatnce, delegateAddr){
        await etherDidInsatnce.addDelegate(delegateAddr, {
            expiresIn: 3600,
            delegateType: "sigAuth"
        });
    }

    async transferOwnerShipToNewAddress(newAddress, callBack){
        const txHash = this.currentUserDid.changeOwner(newAddress)
            .then(res => callBack(true))
            .catch(err => callBack(false));
        // console.log("Owner successfully changed" + txHash.toString());
        return txHash == null ? false : true;
    }
}

// create singleton
const ethDIDManager = new EthDIDManager();
export default ethDIDManager;