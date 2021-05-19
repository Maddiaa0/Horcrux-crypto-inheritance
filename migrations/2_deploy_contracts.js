const BN = require("bn.js");

var ShardManagerContract = artifacts.require("ShardManager");
var RecoveryContract = artifacts.require("Recovery");

module.exports = async (deployer, network, accounts) =>  {
  // get addresses 
  const addresses = await accounts;
  const [goverance, notGovernance, bob, alice] = addresses;

  // deploy the overall managing shard manager contract
  // let shardManagerContract = await ShardManagerContract.new();
  await deployer.deploy(ShardManagerContract);

  // deploy a user's Recovery contract with the shard manager as the parent contract
  const thresholdAmount = new BN(3);
  // let recoveryContract = await RecoveryContract.new(ShardManagerContract.address, goverance, thresholdAmount, { from: goverance});
  await deployer.deploy(RecoveryContract, ShardManagerContract.address, goverance, thresholdAmount);

};
