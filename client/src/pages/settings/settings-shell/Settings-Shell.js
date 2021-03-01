import React, {useState} from "react";
import {Route, Switch, useHistory} from "react-router-dom";

// pages
import EditShardholders from "../edit-share-holders/edit-share-holders";
import SettingsMenu from "../settings-menu/Settings-Menu";

// style
import "./settings-shell.css";

function SettingsShell(){

    return (
        <div className="onboarding-shell">
            Settings
            <Switch>
                <Route exact path="/setup" render={() => <SettingsMenu/>}/>
                <Route path="/settings/edit-shardholders" render={() => <EditShardholders/>}/>
            </Switch>
        </div>
    )
}


export default SettingsShell;