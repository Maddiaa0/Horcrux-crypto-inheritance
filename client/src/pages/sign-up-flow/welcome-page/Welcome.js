import React, {useState} from "react";
import {useHistory} from "react-router-dom";

import {Button} from '@material-ui/core';

function Welcome(){

    const getStartedClicked = (evt) => {
        evt.preventDefault();
        //TODO: push the user to the on boarding explaining how their vault is controlled and used
    }

    return (
        <div className="welcome-container" style={{
            display: "flex",
            flexDirection: "column",
            justifyContent:"center",
            alignItems: "center"
        }}>
            <div style={{
                fontSize: "24px"
            }}>
                Welcome to CryptoVault
            </div>
            <div style={{}}>
                To get started, create an account below, or if you already have an account, you can import your vault below
            </div>

            <div className="row">
                <Button variant="contained">Get started</Button>
                <Button variant="contained">Import vault</Button>
            </div>
        </div>
    )



}

export default Welcome;