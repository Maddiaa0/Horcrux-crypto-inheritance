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




function CreateBIP39(){
    const history = useHistory();    
    // get the bip39 value from our global bip39
    // const bip39Phrase = useRecoilValue(bip39State);

    var phrase = "shelf shelf shelf shelf shelf shelf shelf shelf shelf shelf shelf shelf";
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
                <SignUpParagraph>This secret phrase lets you back up and restore your account and any files you have saved from anywhere</SignUpParagraph>
                <SignUpParagraph>Warning - whoever has possession of this back up phrase has possession of your files, NEVER give it to anyone</SignUpParagraph>
            </div>
            <div>
                Click here for information on how to manage and store you backup phrase
            </div>

            
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


            <div>TODO: Information on where and how they should store all of this information</div>
            


            
        </div>
    )

}

export default CreateBIP39;