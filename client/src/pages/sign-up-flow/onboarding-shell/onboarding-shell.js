import React, {useState} from "react";
import {Route, Switch, useHistory} from "react-router-dom";

import GettingStarted from "../getting-started/Get-Password";
import CreateBIP39 from "../create-bip39-phrase/CreateBIP39";
import InitSocialRecovery from "../init-social-recovery/InitSocialRecovery";
import CreateRecoveryContract from "../init-social-recovery/CreateRecoveryContract";

// style
import "./onboarding-shell.css";

function OnboardingShell(){

    return (
        <div className="onboarding-shell">
            Getting Started
            <Switch>
                <Route exact path="/setup" render={() => <GettingStarted/>}/>
                <Route path="/setup/phrase" render={() => <CreateBIP39/>}/>
                <Route path="/setup/createcontract" render={() => <CreateRecoveryContract/>}/>
                <Route path="/setup/social" render={() => <InitSocialRecovery />}/>
            </Switch>
        </div>
    )
}


export default OnboardingShell;