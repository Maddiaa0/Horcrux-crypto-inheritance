const express = require('express')
const app = express()
const cors = require("cors");
app.use(cors())
app.use(express.json())
const port = 3005
const Web3 = require("Web3");
const RecoveryContractJSON = require("./RecoveryContract.json");

const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"));

function test(recoveryContractAddress, addressTo, shardURI){
    try{
      var contract = new web3.eth.Contract(RecoveryContractJSON.abi, recoveryContractAddress);
      var method = contract.methods.sendShardToShardOwner(addressTo, shardURI).encodeABI();
      return method;
      // web3 encode function call      
    } catch (e){
      console.log(e);
      return null;
    }
  }

function encodeTrigger(recoveryContractAddress, shardURI){
  try{
    var contract = new web3.eth.Contract(RecoveryContractJSON.abi, recoveryContractAddress);
    var method = contract.methods.triggerRecoveryEvent(shardURI).encodeABI();
    return method;
    // web3 encode function call      
  } catch (e){
    console.log(e);
    return null;
  }
}

function encodeSendResponse(recoveryContractAddress, shardURI){
  try{
    var contract = new web3.eth.Contract(RecoveryContractJSON.abi, recoveryContractAddress);
    var method = contract.methods.sendShardToRecoveryInitialiser(shardURI).encodeABI();
    return method;
    // web3 encode function call      
  } catch (e){
    console.log(e);
    return null;
  }
}

app.get('/encodeABI', async (req, res) => {

  const {recoveryContractAddress, addressTo, shardURI} = req.query;
  
  const encodedABI = test(recoveryContractAddress, addressTo, shardURI);
  console.log(encodedABI);
  return res.json({
      abi: encodedABI
  }).status(200).send();
})

app.get('/encodeABItriggerRecovery', async (req, res) => {

  const {recoveryContractAddress, shardURI} = req.query;
  console.log("address, ", recoveryContractAddress);
  console.log("shardURI, ", shardURI);
  
  const encodedABI = encodeTrigger(recoveryContractAddress, shardURI);
  console.log("recovery abi, ", encodedABI);
  return res.json({
      abi: encodedABI
  }).status(200).send();
})

app.get('/encodeABIRespondRecovery', async (req, res) => {

  const {recoveryContractAddress, shardURI} = req.query;
  console.log("address, ", recoveryContractAddress);
  console.log("shardURI, ", shardURI);
  
  const encodedABI = encodeSendResponse(recoveryContractAddress, shardURI);
  console.log("recovery abi, ", encodedABI);
  return res.json({
      abi: encodedABI
  }).status(200).send();
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

