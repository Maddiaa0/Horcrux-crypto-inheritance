import React, {useState} from "react";
import {Route, Switch, useHistory} from "react-router-dom";
import GettingStarted from "../getting-started/Get-Password";

// style
import "./onboarding-shell.css";

function OnboardingShell(){

    return (
        <div className="onboarding-shell">
            Getting Started
            <Switch>
                <Route exact path="/setup" render={() => <GettingStarted/>}/>
            </Switch>
        </div>
    )
}


export default OnboardingShell;