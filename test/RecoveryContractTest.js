const RecoveryContract = artifacts.require("Recovery");
const ShardManagerContract = artifacts.require("ShardManager");
const NFTContract = artifacts.require("ShardNFT");

const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { inTransaction } = require('@openzeppelin/test-helpers/src/expectEvent');
const _deploy_contracts = require('../migrations/2_deploy_contracts');
const chai = require("./setupChai");
const should = chai.should();
const { expect } = chai;

contract("Recovery Contract", accounts => {
  const goverance = accounts[0];
  const notGovernance = accounts[1];
  const accountAlice = accounts[2];
  const accountBob = accounts[3];
  const accountSideshowBob = accounts[4];
  const accountNewOwner = accounts[5];

  let deployedRecovery, amount, logs

  // Get a fresh instance of the contract before each test
  beforeEach(async function() {
    deployedRecovery = await RecoveryContract.deployed();
  });


  describe("Recovery Contract creation", async () => {
    
    it("Should allow the addition of trustees", async function(){
      
      const result = await deployedRecovery.batchAddShardholder([notGovernance], {from: goverance});  
      const isShardHolder = await deployedRecovery.shardHolders.call(notGovernance, {from: goverance});
    
      expect(isShardHolder).to.be.equal(true);
    });  

    it("Should create a valid NFT contract", async () => {
        const NFTAddress = await deployedRecovery.getNFTAddress({from: goverance});
        console.log(NFTAddress);
        expect(NFTAddress).to.not.be.equal(null);
    });

     //TODO: Transfer ownership to a new contract address - whenever the keys are cycled  
  });

  describe("Addition and Access to Trustees", async () => {
    
    it("Should allow the addition of trustees", async function(){
      
      const result = await deployedRecovery.batchAddShardholder([notGovernance], {from: goverance});  
      const isShardHolder = await deployedRecovery.shardHolders.call(notGovernance, {from: goverance});
    
      expect(isShardHolder).to.be.equal(true);
    });  

    it("Should not allow non-owner accounts to add trustee", async function(){
        await expectRevert(deployedRecovery.batchAddShardholder([accountAlice], {from:notGovernance}), "Ownable: caller is not the owner");
    });

    describe("Addition and access to batch added trustees", async function (){

      it("Should allow addition of trustees in a batch upload", async function(){
        const result = await deployedRecovery.batchAddShardholder([accountBob, accountAlice], {from: goverance});
        
        // check both accounts are shardholders
        const isBob = await deployedRecovery.shardHolders.call(accountBob, {from:goverance});
        const isAlice = await deployedRecovery.shardHolders.call(accountAlice, {from: goverance});

        expect(isBob).to.be.equal(true);
        expect(isAlice).to.be.equal(true);
      });

      it("Should not allow non-owner accounts to batch add trustees", async function(){
        await expectRevert(deployedRecovery.batchAddShardholder([accountAlice], {from:notGovernance}), "Ownable: caller is not the owner");
      });

    });

    describe("Allow for the download of the array of trustees", async function(){
      it("Should read array of trustees", async function(){
        const result = await deployedRecovery.trustees.call();
        expect(result).to.be.equal([notGovernance, notGovernance, accountBob, accountAlice]);
      })
    });

  });

  describe("Addition and Access to blacklist", async () => {
    it("Blacklists a trustee correctly", async function(){
        const result = await deployedRecovery.batchBlacklistShardholder([notGovernance], {from: goverance});
        const isBlackListed = await deployedRecovery.blacklisted.call(notGovernance, {from: goverance});

        expect(isBlackListed).to.equal(true);
    });

    it("Should not allow non-owner accounts to add to blacklist", async function(){
        await expectRevert(deployedRecovery.batchBlacklistShardholder([accountAlice], {from:notGovernance}), "Ownable: caller is not the owner");
    });

    it("Should remove a user from the blacklist", async function(){
        const result = await deployedRecovery.batchRemoveBlacklistShardholder([notGovernance], {from:goverance});
        const isBlacklisted = await deployedRecovery.blacklisted.call(notGovernance, {from:goverance});

        expect(isBlacklisted).to.equal(false);
    });

    describe("Batch Blacklist Operations", async function(){
      
      it("Should perform batch additions", async function(){
          const result = await deployedRecovery.batchBlacklistShardholder([accountAlice, accountBob], {from: goverance});
        
        const isAliceBlacklisted = await deployedRecovery.blacklisted.call(accountAlice, {from: goverance});
        const isBobBlacklisted = await deployedRecovery.blacklisted.call(accountBob, {from: goverance});

        expect(isAliceBlacklisted).to.be.equal(true);
        expect(isBobBlacklisted).to.be.equal(true);
      });

      it("Should allow batch removals from the blacklist", async function(){
        const result = await deployedRecovery.batchRemoveBlacklistShardholder([accountAlice, accountBob], {from: goverance});
        
        const isAliceBlacklisted = await deployedRecovery.blacklisted.call(accountAlice, {from: goverance});
        const isBobBlacklisted = await deployedRecovery.blacklisted.call(accountBob, {from: goverance});

        expect(isAliceBlacklisted).to.be.equal(false);
        expect(isBobBlacklisted).to.be.equal(false);
      })

    })
  });


  describe("Trustee can verify they wish to partake in the sharing scheme", async function(){

    it("User who has been added to shortlist should be able to call verify", async function(){
        const result = await deployedRecovery.batchAddShardholder([notGovernance], {from: goverance});
        const isShardholder = await deployedRecovery.shardHolders.call(notGovernance, {from: goverance});

        expect(isShardholder).to.equal(true);
        // notGovernance should be able to call verify method
        const verifyResult = await deployedRecovery.confirmTrustee({from: notGovernance});
        const confirmed = await deployedRecovery.confirmed(notGovernance, {from: goverance});

        const blockNumber = await deployedRecovery.confirmedBlockNo(notGovernance, {from:goverance});
        console.log(blockNumber);

        expect(confirmed).to.be.equal(true);
    });

    it("User who has NOT BEEN added to shortlist should not be able to call verify", async function(){
        // notGovernance should be able to call verify method
        await expectRevert(deployedRecovery.confirmTrustee({from: accountSideshowBob}), "Sender is not a trustee");

        const confimed = await deployedRecovery.confirmed.call(accountBob, {from:goverance});
        expect(confimed).to.be.equal(false);
    })

  });



  describe("Triggering the Recovery Event", async () => {

     beforeEach(async function() {
            deployedRecovery = await RecoveryContract.new(
                ShardManagerContract.address, goverance, new BN(3)
            );
        }
     )

      it("Does not allow non trustees / not contract owner to trigger a recovery event", async function(){
          await expectRevert(deployedRecovery.triggerRecoveryEvent("QmbKi2jXuKCdy4BBKMF8zMopvCS3JHsCKP48ZA11xd75Bs", {from: accountBob}), "Not a valid Trustee");
      });

      it("Initialises the address initialising recovery to be 0x0", async function(){
        const triggeredRecovery = await deployedRecovery.viewWhoTriggeredRecovery({from: accountBob});
        expect(triggeredRecovery).to.be.equal("0x0000000000000000000000000000000000000000");
      })

      it("Sends a recovery NFT to the trustees addresses", async function(){
        // add alice as a shardholder
        const result = await deployedRecovery.batchAddShardholder([accountAlice], {from: goverance});
        const isShardHolder = await deployedRecovery.shardHolders.call(accountAlice, {from: goverance});
        expect(isShardHolder).to.be.equal(true);

        // Make alice send out a recovery event with a particular payload
        await deployedRecovery.triggerRecoveryEvent("QmbKi2jXuKCdy4BBKMF8zMopvCS3JHsCKP48ZA11xd75Bs", {from: accountAlice});
        
        // Check that the recovery NFT has been issued to alice the trustees account
        const NFTContractAddress = await deployedRecovery.getNFTAddress();
        const NFTInstance = await NFTContract.at(NFTContractAddress);

        const aliceBalance = await NFTInstance.balanceOf(accountAlice, {from: goverance});
        expect(aliceBalance).to.be.a.bignumber.equal(new BN(1)); 
        
        const aliceToken = await NFTInstance.tokenURI(1);
        expect(aliceToken).to.be.equal("QmbKi2jXuKCdy4BBKMF8zMopvCS3JHsCKP48ZA11xd75Bs");
      });

      it("Sets the address initiating recovery to be that who initialised recovery", async function(){
        // add alice as a shardholder
        const result = await deployedRecovery.batchAddShardholder([accountAlice], {from: goverance});
        const isShardHolder = await deployedRecovery.shardHolders.call(accountAlice, {from: goverance});
        expect(isShardHolder).to.be.equal(true);

        // Make alice send out a recovery event with a particular payload
        await deployedRecovery.triggerRecoveryEvent("QmbKi2jXuKCdy4BBKMF8zMopvCS3JHsCKP48ZA11xd75Bs", {from: accountAlice});

        // Check that the contract is in recovery mode and has been issued
        const triggeredRecovery = await deployedRecovery.viewWhoTriggeredRecovery({from: accountBob});
        expect(triggeredRecovery).to.be.equal(accountAlice);
      });

  });

  describe("Responding to Recovery Event", async function(){
    beforeEach(async function() {
        deployedRecovery = await RecoveryContract.new(
            ShardManagerContract.address, goverance, new BN(3)
        );
    });

    it("Does not allow user to respond to recovery event if recovery has not been initilaised", async function(){
        await expectRevert(deployedRecovery.sendShardToRecoveryInitialiser("QmbKi2jXuKCdy4BBKMF8zMopvCS3JHsCKP48ZA11xd75Bs"), "Recovery not yet initialised");
    });

    it("Does not allow untrusteed user to send their own recovery NFT", async function(){
        // add alice as a shardholder
        const result = await deployedRecovery.batchAddShardholder([accountAlice], {from: goverance});
        const isShardHolder = await deployedRecovery.shardHolders.call(accountAlice, {from: goverance});
        expect(isShardHolder).to.be.equal(true);

        // Make alice send out recovery
        await deployedRecovery.triggerRecoveryEvent("QmbKi2jXuKCdy4BBKMF8zMopvCS3JHsCKP48ZA11xd75Bs", {from: accountAlice});

        // bob is not allowed to send his recovery NFT
        await expectRevert(deployedRecovery.sendShardToRecoveryInitialiser("QmbKi2jXuKCdy4BBKMF8zMopvCS3JHsCKP48ZA11xd75Bs", {from: accountBob}), "Not a valid Trustee");
    });

    it("Successfully allows trusted user to send recovery NFT", async function(){
        // add alice and bob as shardholders
        await deployedRecovery.batchAddShardholder([accountAlice], {from: goverance});
        await deployedRecovery.batchAddShardholder([accountBob], {from: goverance});
        const isAliceShardHolder = await deployedRecovery.shardHolders.call(accountAlice, {from: goverance});
        const isBobShardHolder = await deployedRecovery.shardHolders.call(accountBob, {from:goverance});
        expect(isAliceShardHolder).to.be.equal(true);
        expect(isBobShardHolder).to.be.equal(true);

        // Make alice send out a recovery event with a particular payload
        await deployedRecovery.triggerRecoveryEvent("QmbKi2jXuKCdy4BBKMF8zMopvCS3JHsCKP48ZA11xd75Bs", {from: accountAlice});
        
        // Check that the recovery NFT has been issued to alice the trustees account
        const NFTContractAddress = await deployedRecovery.getNFTAddress();
        const NFTInstance = await NFTContract.at(NFTContractAddress);

        const bobBalance = await NFTInstance.balanceOf(accountBob, {from: goverance});
        expect(bobBalance).to.be.a.bignumber.equal(new BN(1)); 
        
        const aliceToken = await NFTInstance.tokenURI(1);
        expect(aliceToken).to.be.equal("QmbKi2jXuKCdy4BBKMF8zMopvCS3JHsCKP48ZA11xd75Bs");

        // bob sends his shard token to alice
        await deployedRecovery.sendShardToRecoveryInitialiser("Returned From Bob", {from: accountBob});
        
        // alice should now be in possession of 2 tokens
        const aliceBalance = await NFTInstance.balanceOf(accountAlice, {from: goverance});
        expect(aliceBalance).to.be.a.bignumber.equal(new BN(2));
        
        const bobRecoveryToken = await NFTInstance.tokenURI(3);
        expect(bobRecoveryToken).to.be.equal("Returned From Bob");
    });

  });

  // Key cycling shall be allowed with BIP32, the idea of this method is that changing the owner using ownable will be possible
  describe("Recovery Contract can change owner", async function(){
    it("Successfully transfers of ownership to a new address", async function(){
      const result = await deployedRecovery.transferOwnership(accountNewOwner, {from: goverance});
      const owner = await deployedRecovery.owner({from: accountNewOwner});

      expect(owner).to.be.equal(accountNewOwner);
    });

    it("An account that is not the owner cannot transfer ownership", async function(){
      await expectRevert(
        deployedRecovery.transferOwnership(accountAlice, { from: accountAlice }),
        'Ownable: caller is not the owner',
      );
    });

    it("New owner can perform ownable tasks", async function(){
      const result = await deployedRecovery.getNFTAddress({from: accountNewOwner});
      expect(result).to.not.be.equal(null); 
    });

    it("Old owner is unable to perform ownable tasks", async function(){
      await expectRevert(
        deployedRecovery.getNFTAddress({ from: goverance }),
        'Ownable: caller is not the owner',
      );
    });

    it("Ownership can be transfered back to the old owner", async function(){
      const result = await deployedRecovery.transferOwnership(goverance, {from: accountNewOwner});
      const owner = await deployedRecovery.owner({from: goverance});

      expect(owner).to.be.equal(goverance);
    });
  })




  //TODO: Transfer ownership to a new contract address - whenever the keys are cycled
});
