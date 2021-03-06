// import EthrDIDRegistry from "./contracts/EthereumDIDRegistry.json";
import Recovery from "./contracts/Recovery.json";
import ShardManager from "./contracts/ShardManager.json";
import ShardNFT from "./contracts/ShardNFT.json";

const options = {
    contracts: [
        // EthrDIDRegistry,
        Recovery,
        ShardManager,
        ShardNFT
    ],
    web3:{
        fallback:{
            type:"ws",
            url:"ws://127.0.0.1:8545"
        }
    }
}

export default options;