import React, {useState, useEffect} from "react";

// components
import { Button, TextField } from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

// constants
import {ethValidatorMessages} from "../../helpers/constants/error-messages";
import RecoveryContractManager from "../../services/RecoveryContractManager";
import getWeb3 from "../../getWeb3";
import { isEthereumAddress } from "../../helpers/utils/utils";


/**Verify Page
 * 
 * This page will be shown from the landing page, when a user does not have an account, but wishes to connect their
 * wallet and verify that they are a shardholder for a user's particular recovery contract address!
 */
function VerifyPage(){
    const [ethAddress, setEthAddress] = useState("");
    const [web3, setWeb3] = useState(null);

    useEffect(() => {
        async function getWeb(){
            setWeb3(await getWeb3());
        }

        getWeb();

        ValidatorForm.addValidationRule("isEthAddress", (value) => {
            return (isEthereumAddress(value));
          });
    }, []);

    async function validateUser(evt){
        evt.preventDefault();
        // check that there is an address inside metamask
        console.log(web3);
        if (web3.currentProvider.selectedAddress === null){
            alert("Please connect with metamask to continue");
        }

        if (ethAddress != "" && isEthereumAddress(ethAddress)){
            await RecoveryContractManager.verifyRecoveryContractFromAddress(ethAddress);
        }
    }

    async function checkIfTrustee(){
        if (web3.currentProvider.selectedAddress === null){
            alert("Please connect with metamask to continue");
        }

        if (ethAddress != "" && isEthereumAddress(ethAddress)){
            const isTrustee = await RecoveryContractManager.isUserATrustee(ethAddress);
            if (isTrustee) alert("You are a trustee for this user");
            else alert("You are not a trustee for this user");
        }
    }

    return (
        <div>
            Verify Recovery
            <div>
                Enter the Eth or Recovery Contract address of the account you wish to verify.
            </div>
            <div>
                <ValidatorForm onSubmit={validateUser}>
                    <TextValidator
                        key="eth-input"           
                        type="text"
                        variant="outlined"
                        placeholder="Enter Eth Address"
                        value={ethAddress}
                        onChange={evt => setEthAddress(evt.target.value)} 
                        validators={ethValidatorMessages.isEthAddress}
                        errorMessages={ethValidatorMessages.isEthErrorMessage}
                    />

                    <Button type="submit">Verify as Trustee</Button>
                    <Button type="button" onClick={checkIfTrustee}>Check if Trustee</Button>
                </ValidatorForm>


            </div>
        </div>
    )
    
}


export default VerifyPage;