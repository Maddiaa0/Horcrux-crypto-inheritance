
/**is Ethereum Address
 * 
 * Returns a boolean confirming if the given string is a ethereum address
 * @param {String} address 
 */
const isEthereumAddress = (address) => {
    const re = new RegExp("^0x[a-fA-F0-9]{40}$");
    return re.test(address);
}

export {
    isEthereumAddress
};