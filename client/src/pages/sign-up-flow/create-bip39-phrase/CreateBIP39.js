import React from "react";
import {useHistory} from 'react-router-dom';

// componenets
import {Button} from "@material-ui/core";

// services
import cryptoService from "../../../services/CryptoManager";


function CreateBIP39(){

    


    return (
        <div className="create-bip-container">
            <div>
                <div>Secret Backup Phrase</div>
                <div>This secret phrase lets you back up and restore your account and any files you have saved from anywhere</div>
                <div>Warning - whoever has possession of this back up phrase has possession of your files, NEVER give it to anyone</div>
            </div>
            <div>
                Click here for information on how to manage and store you backup phrase
            </div>

            <div>
                Where the passphrase will be shown
            </div>


            <div>
                Click here to reveal your secret phrase
            </div>


            <div>
                <Button>
                    Remind me later - not recommended
                </Button>            
                <Button>
                    Next
                </Button>
            </div>


            <div>TODO: Information on where and how they should store all of this information</div>
            


            
        </div>
    )

}

export default CreateBIP39;