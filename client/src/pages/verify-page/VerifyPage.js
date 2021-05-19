import React, {useState, useEffect} from "react";

// components
import { AppBar, Button, Grid, Hidden, TextField, Toolbar, Typography } from "@material-ui/core";
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
    const [currentAddress, setCurrentAddress] = useState(null);

    useEffect(() => {
        async function getWeb(){
            const localWeb3 = await getWeb3();
            setCurrentAddress(localWeb3.currentProvider.selectedAddress)
        }

        getWeb();

        ValidatorForm.addValidationRule("isEthAddress", (value) => {
            return (isEthereumAddress(value));
          });
    }, []);

    async function validateUser(evt){
        evt.preventDefault();
        // check that there is an address inside metamask
        if (currentAddress === null){
            alert("Please connect with metamask to continue");
        }

        if (ethAddress !== "" && isEthereumAddress(ethAddress)){
            await RecoveryContractManager.verifyRecoveryContractFromAddress(ethAddress);
        }
    }

    async function checkIfTrustee(){
        if (currentAddress === null){
            alert("Please connect with metamask to continue");
        }

        if (ethAddress !== "" && isEthereumAddress(ethAddress)){
            const isTrustee = await RecoveryContractManager.isUserATrustee(ethAddress);
            if (isTrustee) alert("You are a trustee for this user");
            else alert("You are not a trustee for this user");
        }
    }

    return (
        <>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">

            <Grid item xs />
            <Grid item>
            
                {currentAddress}
            
            </Grid>
            <Grid item>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        // className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                {/* THIS SHOULD CHANGE WITH THE USERS */}
                Verify Recovery as Trustee
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
        <div style={{
            marginLeft: "30px",
            marginTop: "30px"
        }}>

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
        </>
    )
    
}


export default VerifyPage;

