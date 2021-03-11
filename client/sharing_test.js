const sss = require("secrets.js");
const { isConstructorDeclaration } = require("typescript");

const secretText = "divide ready renew spare horror sun school theory violin water zebra bench";
const secretBuffer = sss.str2hex(secretText);
console.log(secretBuffer);
const shares = sss.share(secretBuffer, 100, 3);
console.log(shares);

const combined = sss.combine(shares.slice(0,3));
console.log(combined);
console.log(sss.hex2str(combined))

const addedShare = sss.newShare(5, shares);
console.log(addedShare);
console.log(shares);
const combo = sss.combine([ shares[0], shares[3], addedShare]);
console.log(combo);
console.log(sss.hex2str(combo));

