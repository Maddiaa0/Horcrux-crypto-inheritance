import { Button, TextField } from "@material-ui/core";
import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";

// services
import KeyManager from "../../../services/KeyManager";
import {passwordValidatorMessages} from "../../../helpers/constants/error-messages";

// components
import Column from "../../../components/Column";
import SignUpParagraph from "../../../components/sign-up/SignUpParagraph";
import SignUpTitle from "../../../components/sign-up/SignUpTitle";

import {TextValidator, ValidatorForm} from "react-material-ui-form-validator";
import { create } from "domain";

// TODO: Fix up styling for most of the stuff in here

function GettingStarted(){
    const history = useHistory();

    // Set up validators for passwords
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // go to the next page in setup
    const goToNext = evt => {
        evt.preventDefault();
        if (password === confirmPassword){
            createAccountAndEncrypt(password);
            history.push("/setup/phrase");
        }   
    }

    useEffect(() => {
        ValidatorForm.addValidationRule("passwordsMatch", (value) => {
            return (value !== password);
          });

          ValidatorForm.addValidationRule("required", (value) => {
            return (value !== "");
          });
    }, []);

    const createAccountAndEncrypt = password => {
        KeyManager.generateAndStoreMnemonicFromPassword(password);
    }

    return (
        <div className="getting-started-container">
            <SignUpTitle>
                Create An Account
            </SignUpTitle>
            <SignUpParagraph>
                To get started, we will need a password which will be used to keep your keys encrypted within your browser.
            </SignUpParagraph>
            <ValidatorForm onSubmit={goToNext} >
                <Column>
                    <TextValidator 
                        id="password-create" 
                        name="password-create"  
                        label="Password" 
                        variant="outlined"
                        validators= {passwordValidatorMessages.passwordsMatch}
                        errorMessages={passwordValidatorMessages.passwordsMatchErrorMessage}
                        value={password}
                        onChange={(evt) => setPassword(evt.target.value)}
                    />
                    <TextValidator 
                        id="password-confirm" 
                        name="password-confirm"  
                        label="Confirm Password" 
                        variant="outlined"
                        validators= {passwordValidatorMessages.passwordsMatch}
                        errorMessages={passwordValidatorMessages.passwordsMatchErrorMessage}
                        value={confirmPassword}
                        onChange={evt => setConfirmPassword(evt.target.value)}
                    />
                </Column>
                <div className="continue-button">
                    <Button 
                        type="submit" 
                        id="button-continue" 
                        variant="contained"
                    >
                        Continue
                    </Button>
                </div>
            </ValidatorForm>
            
        </div>
    )
}

export default GettingStarted;