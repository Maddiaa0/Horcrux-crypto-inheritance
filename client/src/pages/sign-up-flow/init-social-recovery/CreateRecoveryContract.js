import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";

//components
import {Button} from "@material-ui/core";
import SignUpTitle from "../../../components/sign-up/SignUpTitle";
import SignUpParagraph from "../../../components/sign-up/SignUpParagraph";
import keyManager from "../../../services/KeyManager";
import cryptoManager from "../../../services/CryptoManager";
import RecoveryContractManager from "../../../services/RecoveryContractManager";

const ethUtil = require('ethereumjs-util')

function CreateRecoveryContract(){
    const history = useHistory();

    const [keys, setKeys] = useState({});
    const [ethAddress, setEthAddress] = useState("");

    async function getKeys(){
        const _keys = keyManager.getKeysFromStorage("password");
        console.log(_keys);
        const addr = ethUtil.privateToAddress(`0x${_keys.privKey}`);
        const _ethAddress = `0x${addr.toString("hex")}`;
        setEthAddress(_ethAddress);
        setKeys(_keys);
    }

    useEffect(() => {
        getKeys();
    }, []);


    async function createRecoveryContract(){
        RecoveryContractManager.createRecoveryContract(ethAddress)
        RecoveryContractManager.listenForRecoveryContractCreation(ethAddress, function(){
            alert("Recovery Contract Created Successfully");
        })
    }

    function createContract(evt){
        evt.preventDefault()
        createRecoveryContract()
    } 

    function goToNextPage(evt){
        evt.preventDefault();
        history.push("/setup/social");
    }

    return (
        <div>
            <SignUpTitle>
                Create Recovery Contract
            </SignUpTitle>
            <SignUpParagraph>
                In order to set up anonymous social recovery you will need to create a contract that is linked to yourEthereum address.
                <br/>
                This will cost you a fee depending on network usage.
                MetaMask will prompt you to to sign a transaction in order to generate a recovery contract.
            </SignUpParagraph>
            <SignUpParagraph>
                You must have funds within your ethereum address for the transaction to go through.
            </SignUpParagraph>
            <SignUpParagraph>
                Your public and private keys are:
            </SignUpParagraph>
            <SignUpParagraph>
                Public Key: {keys.pubKey}
            </SignUpParagraph>
            <SignUpParagraph>
                Private Key: {keys.privKey}
            </SignUpParagraph>
            <SignUpParagraph>
                This corresponds to the following Ethereum Address: {ethAddress}
            </SignUpParagraph>

            <SignUpParagraph>
                Import your private key into metamask and provide Eth to continue to make transactions.
            </SignUpParagraph>

            <Button 
                variant="contained"
                onClick={createContract}
            >
                Create Contract
            </Button>
            <Button
                variant="containd"
                onClick={goToNextPage}
            >
                Continue
            </Button>

        </div>
    )
}

export default CreateRecoveryContract;