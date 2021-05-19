import React from "react";
import {useHistory} from 'react-router-dom';

// recoil state
import { useRecoilValue } from "recoil";
import {bip39State} from "../../../recoil-state/auth-atoms";

// componenets
import {Button} from "@material-ui/core";

// services
import cryptoService from "../../../services/CryptoManager";
import SignUpTitle from "../../../components/sign-up/SignUpTitle";
import SignUpParagraph from "../../../components/sign-up/SignUpParagraph";
import KeyManager from "../../../services/KeyManager";

// style
import "./createBIP39.css";
import Bip39Box from "../../../components/sign-up/Bip39Box";
import BIP39MoreInfoDialog from "../../../components/sign-up/Bip39MoreInfoDialog";




function CreateBIP39(){
    const history = useHistory();    
    // get the bip39 value from our global bip39
    // const bip39Phrase = useRecoilValue(bip39State);

    var phrase = "student aim pottery dentist evoke salmon clean buzz taxi civil weapon jacket";
    //TODO: Bring this back after demo
    if (KeyManager.mnemonic === null ){
        alert("Mnemonic failed to generate");
    } else {
        phrase = KeyManager.mnemonic;
    }


    const goToNext = evt => {
        evt.preventDefault();
        history.push("/setup/createcontract")
    }
    
    return (
        <div className="create-bip-container">
            <div>
                <SignUpTitle>Secret Backup Phrase</SignUpTitle>
                <SignUpParagraph>This secret phrase lets you back up and recovery your files you have from anywhere</SignUpParagraph>
                <SignUpParagraph>Warning - whoever is in possession of this back up phrase will be able to access your files, keep it sage and NEVER give it to anyone</SignUpParagraph>
            </div>
            <BIP39MoreInfoDialog/>
            
            <Bip39Box phrase={phrase}/>

            <div>
                Click here to reveal your secret phrase
            </div>


            <div>
                <Button>
                    Remind me later - not recommended
                </Button>            
                <Button onClick={goToNext}>
                    Next
                </Button>
            </div>
        </div>
    )

}

export default CreateBIP39;