import ipfsClient from 'ipfs-http-client';

class CasManager {

    /**
     * Initialise and connect to an ipfs instance, in this case we will connect to a 
     * local node
     */
    constructor(){
        const ipfs = ipfsClient({ host: 'localhost', port: '5001', protocol: 'http' });
        this.ipfs = ipfs;
    }

    /**
     * Checks if a local ipfs instance has been initilaised
     */
    checkIpfsInitialised(){
        return this.ipfs !== null;
    }

    /**Publish the provided ipfs address to ipns
     * 
     * @param {String} _ipfsAddr 
     */
    publishToIpns(_ipfsAddr){
        this.ipfs.name.publish(_ipfsAddr).then(function (res) {
            // You now receive a res which contains two fields:
            //   - name: the name under which the content was published.
            //   - value: the "real" address to which Name points.
            console.log(`https://gateway.ipfs.io/ipns/${res.name}`)
          })
    }

    /**
     * Create a new IPNS keypair 
     */
    async createNewIPNSKeyPair(){
        const key = await this.ipfs.key.gen("user-key", {
            type:"rsa",
            size: "2048"
        });
        return key;
    }

    /**
     * Returns a pem encoded key that can be added to the eth blockchain for storage
     * @param {String} password 
     */
    async exportKeyToAddToChain(password){
        const pemFile = await this.ipfs.key.export("user-key", password);
        return pemFile;
    }







    /**
     * ping where the decentralised identity ipfs service endpoitn points to to 
     * ensure that the user's databucket is infact stored there
     */
    pingIpnsBucketInstance(){
        //TODO
    }


}