const ShardManagerContract = artifacts.require("ShardManager");

// @ts-ignore
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
// const { inTransaction } = require('@openzeppelin/test-helpers/src/expectEvent');
const should = require("chai").should();
const { expect } = require('chai');

contract("Shard Manager Contract", accounts => {
  const goverance = accounts[0];
  const notGovernance = accounts[1];
  const accountAlice = accounts[2];
  const accountBob = accounts[3];

  let deployedManager, amount, logs

  // Get a fresh instance of the contract before each test
  beforeEach(async function() {
    deployedManager = await ShardManagerContract.deployed();
  });


  describe("Recovery Contract creation", async () => {
    
    it("Should Create a recovery contract for any user", async function(){
      // an event should be emitted
      const _threshold = 3;
      const result = await deployedManager.createRecoveryContract(goverance, _threshold, {from: goverance});
      const userRecoveryAddress = result.logs[0].args.contractAddress;
      const userOwnerAddress = result.logs[0].args.ownerAddress; 

      expect(userRecoveryAddress).to.not.be.equal(null);
      expect(userOwnerAddress).to.be.equal(goverance);

    });  

    it("Should be able to retreive recovery contract address", async () => {
      const recoveryContractAddress = await deployedManager.contractMappings.call(goverance);
      expect(recoveryContractAddress).to.not.be.equal(null);
    });
  
  
  });

  describe("Normal addresses should not be able to trigger the transfer contract owner function", async function(){
    it("Should revert transactions to transfer owner made by addresses", async function(){
      const recoveryContractAddress = await deployedManager.contractMappings.call(goverance);
      expect(recoveryContractAddress).to.not.be.equal(null);

      await expectRevert(
        deployedManager.setNewContractOwner(notGovernance, goverance, recoveryContractAddress, { from: goverance }),
        'Sender not Contract',
      );
    })
  });
});
