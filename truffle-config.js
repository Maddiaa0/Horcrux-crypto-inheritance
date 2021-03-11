const path = require("path");
require("dotenv").config({path: "./.env"});

// set the system up using the HDWallet provider
const HDWalletProvider = require("@truffle/hdwallet-provider");
const accountIndex = 0;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop:{
      host:"localhost",
      port:"8545"
    },

    development: {
      host:"localhost",
      port: 7545,
      network_id: 5777,
      provider: function(){
        return new HDWalletProvider(process.env.GANACHE_MNEMONIC, "http://127.0.0.1:7545", accountIndex);
      }
    },
    // ganache_local:{
    //   provider: function() {
    //     return new HDWalletProvider(process.env.GANACHE_MNEMONIC, "http://127.0.0.1:7545", accountIndex);
    //   },
    //   network_id: 5777,
    // }
  },
  compilers:{
    solc:{
      version: "0.7.4"
    }
  }
};
