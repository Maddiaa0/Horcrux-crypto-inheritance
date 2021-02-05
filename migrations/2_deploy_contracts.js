var EthDidRegistryContract = artifacts.require("EthereumDIDRegistry");


module.exports = function(deployer) {
  deployer.deploy(EthDidRegistryContract);
};
