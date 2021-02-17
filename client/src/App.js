import React, { useState, useEffect } from "react";
import getWeb3 from "./getWeb3";

// Our Components
// import FirstTimeFlow from './pages/first-time-flow'

import "./App.css";
import cryptoManager from "./services/CryptoManager";
import keyManager from "./services/KeyManager";
import identityManager from "./services/IdentityManager";

import DidRegContract from "./contracts/EthereumDIDRegistry.json";

// set up registry contract
const DidRegistryContract = require('ethr-did-registry')

function App(){
  
  const [regInstance, setRegInstance] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [ethDid, setEthDid] = useState(null);
  

  useEffect( () => {
    async function init() {
      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
        // Use web3 to get the user's accounts.
        const accounts = web3.eth.getAccounts();
  
        // Get the contract instance.
        const networkId = web3.eth.net.getId();
        // const deployedNetwork = SimpleStorageContract.networks[networkId];
        // const instance = new web3.eth.Contract(
        //   SimpleStorageContract.abi,
        //   deployedNetwork && deployedNetwork.address,
        // );
  
        const deployedNetwork = DidRegContract.networks[5777];
        const RegInstance = new web3.eth.Contract(
            DidRegContract.abi,
            deployedNetwork && deployedNetwork.address,
        );
        setRegInstance(RegInstance);
        
  
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        // this.setState({ web3, accounts, contract: instance }, this.runExample);
        
        // await identityManager.initTruffleResolver(RegInstance.address);
  
        await identityManager.initKovanResolver();
  
        // this.listenToAttributeEvents(RegInstance);
        setWeb3(web3);
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
    }
  
    init();

  }, []);

  async function runExample(){
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };


  function listenToAttributeEvents(instance){
    instance.events.DIDAttributeChanged({identity: "0x21f754ef0adb6279b03d2a2821a8fa667779fe06"}).on("data", async (data) => {
      console.log("Attribute update event logged");
      console.log(data);
      console.log("new resolved");
      const resolved = await identityManager.resolveDid("did:ethr:0x21f754ef0adb6279b03d2a2821a8fa667779fe06");
      console.log(resolved);
    });
    // this.tokenInstance.events.Transfer({to: this.accounts[0]}).on("data", this.updateUserTokens);
  }

  async function handleClick(evt){
    evt.preventDefault();
    // Just do some testing using the new services i have created
    // Generate Mnmomic 
    // const cryptoMan = cryptoManager;
    // const Mn = cryptoMan.generateMnemomic();
    // console.log(Mn); 

    // keyManager.setPasswordhash("password_test");

    // const passhash = await keyManager.getPasswordHash();
    // console.log(passhash);

    // console.log("checking the two match");
    // console.log(keyManager.comparePassAndHash("password_test", passhash));

    // console.log("generate pub / priv from mnemonic");
    // const pubPriv = await cryptoMan.getPublicPrivateKeyAtIndex(Mn, 0);
    // console.log(pubPriv);

    // const ethAddress = await cryptoMan.createEthAddressFromPubKey(pubPriv.pubKey);
    // console.log(ethAddress);
    // const ethDid = await identityManager.didEtherCreate(ethAddress, pubPriv.privKey);


    // test creating from ganache
    // const ethDid = await identityManager.didEtherCreateFromGanache();
    // const ethDid = await identityManager.didEtherCreateFromTruffle(this.state.web3);
    const ethDidd = await identityManager.didEtherCreateKovan("0x08Eda6a573cc95D51C0A8b73b7CCd3390AB65Aa2", web3.currentProvider);

    console.log(ethDidd);
    setEthDid(ethDidd);

    // console.log(await ethDid.createSigningDelegate());
    

    // Change the owener of the did
    // await ethDid.changeOwner("0x834038beEAB27C22d8c59562F765F6915FB2E7Ff");
    // const resolved3 = await identityManager.resolveDid(ethDid.did);
    // console.log("resolved 3");
    // console.log(resolved3);
  }

  async function addIpns (evt){
    evt.preventDefault();

    // add an endpoint to the new DID
    console.log("Adding ipns endpoint");
    console.log(ethDid);
    await identityManager.addIPNSEndpointToDid(ethDid);
    
    // resolve the new did with the added endpoint
    const resolved2 = await identityManager.resolveDid(ethDid.did);
    console.log("resolved 2");
    console.log(resolved2);
  }

  async function resolveDid(evt){
    evt.preventDefault();

    
    const resolved = await identityManager.resolveDid(ethDid.did);
    console.log(resolved);   

    const res2 = await identityManager.resolveDidVer(ethDid.did);
    console.log(res2);
  }


  async function addDelegate(evt){
    evt.preventDefault(); 
    // const tempKeyPair = await ethDid.createSigningDelegate("sigAuth", 360);
    // console.log(tempKeyPair);
    console.log(web3.eth.accounts[0]);
    await identityManager.addDelegate(ethDid,"0x1722Dd5037C27b6bAdCEEA0EE3a5a996313C9fC8");
  }

  
  if (!web3) {
    return <div>Loading Web3, accounts, and contract...</div>;
  }
  return (
    <div className="App">
      {/* <FirstTimeFlow></FirstTimeFlow> */}
      <button type="button" onClick={handleClick}>get did</button>
      <button type="button" onClick={addIpns}>add endpoint</button>
      <button type="button" onClick={resolveDid}>resolveDid</button>
      <button type="button" onClick={addDelegate}>addDelegate</button>
    </div>
  );
  
}

export default App;
