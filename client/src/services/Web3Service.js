import recoveryContractManager from "./RecoveryContractManager";

class Web3Service{
    constructor(){
        this.web3 = null;
    }

    initWeb3(web3){
        this.web3 = web3;
        // recoveryContractManager.initWeb3Provider(web3);
    }
}

const web3Service = new Web3Service();
export default web3Service;