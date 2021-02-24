import { Button, TextField } from "@material-ui/core";
import React from "react";
import {useHistory} from "react-router-dom";
import Column from "../../../components/Column";
import SignUpParagraph from "../../../components/sign-up/SignUpParagraph";

import SignUpTitle from "../../../components/sign-up/SignUpTitle";

// TODO: Fix up styling for most of the stuff in here

function GettingStarted(){
    return (
        <div className="getting-started-container">
            <SignUpTitle>
                Create An Account
            </SignUpTitle>
            <SignUpParagraph>
                To get started, we will need a password which will be used to keep your keys encrypted within your browser.
            </SignUpParagraph>
            <Column>
                <TextField id="password-create" name="password-create"  label="Password" variant="outlined" />
                <TextField id="password-confirm" name="password-confirm"  label="Confirm Password" variant="outlined" />
            </Column>
            <div className="continue-button">
                <Button id="button-continue" variant="contained">Continue</Button>
            </div>
        </div>
    )
}

export default GettingStarted;