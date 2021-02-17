const ShardManagerContract = artifacts.require("ShardManager");

const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { inTransaction } = require('@openzeppelin/test-helpers/src/expectEvent');
const should = require("chai").should();
const { expect } = require('chai');

contract("Shard Manager Contract", accounts => {
  const goverance = accounts[0];
  const notGovernance = accounts[1];
  const accountAlice = accounts[2];
  const accountBob = accounts[3];

  let deployedmanager, amount, logs

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
      const userOwnerAddress = result.logs[0].args._ownerAddress;
      const userRecoveryContractState = result.logs[0].args.step;

      expect(userRecoveryAddress).to.not.be.equal(null);
      expect(userOwnerAddress).to.be.equal(goverance);
      expect(userRecoveryContractState).to.be.a.bignumber.equal(new BN(0));

    });  

    it("Should be able to retreive recovery contract address and state", async () => {
      const recoveryContractAddress = await deployedManager.checkRecoveryContractAddress(goverance);
      expect(recoveryContractAddress).to.not.be.equal(null);
      const recoveryContractState = await deployedManager.checkRecoveryContractState(goverance);
      expect(recoveryContractState).to.be.a.bignumber.equal(new BN(0));
    });


  
  
  });
});
