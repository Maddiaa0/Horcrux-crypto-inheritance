  
"use strict";
// import chai 
const chai = require("chai");

// set up big number for use
const BN = web3.utils.BN;
const chaiBN = require("chai-bn")(BN);
chai.use(chaiBN);

// set up chai as promised 
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

module.exports = chai;