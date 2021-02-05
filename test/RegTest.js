const DIDRegistry = artifacts.require("EthereumDIDRegistry");



contract("Did Registry", accounts => {
  it("...should add attribute.", async () => {
    const RegistryInstance = await DIDRegistry.deployed();

    // Set value of 89
    await RegistryInstance.set(89, { from: accounts[0] });

    // Get stored value
    const storedData = await simpleStorageInstance.get.call();

    assert.equal(storedData, 89, "The value 89 was not stored.");
  });
});
