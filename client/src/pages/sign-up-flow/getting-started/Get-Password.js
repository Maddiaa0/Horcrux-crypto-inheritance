import { Button, TextField } from "@material-ui/core";
import React from "react";
import {useHistory} from "react-router-dom";

function GettingStarted(){


    return (
        <div className="getting-started-container">
            <div>
                Create An Account
            </div>
            <div>
                To get started, we will need a password which will be used to keep your keys encrypted within your browser.
            </div>
            <div className="passwords-containers">
                <TextField id="password-create" name="password-create"  label="Password" variant="outlined" />
                <TextField id="password-confirm" name="password-confirm"  label="Confirm Password" variant="outlined" />
            </div>
            <div className="continue-button">
                <Button id="button-continue" variant="contained">Continue</Button>
            </div>
        </div>
    )
}

export default GettingStarted;