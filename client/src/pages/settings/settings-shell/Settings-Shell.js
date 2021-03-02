import React, {useState} from "react";
import {Route, Switch, useHistory} from "react-router-dom";
import SectionHeader from "../../../components/typography/SectionHeader";

// pages
import EditShardholders from "../edit-share-holders/edit-share-holders";
import SettingsMenu from "../settings-menu/Settings-Menu";

// components
import SettingsMenuCard from "../../../components/settings/settings-menu-card/SettingsMenuCard";

// style
import "./settings-shell.css";

function SettingsShell(){

    return (
        <div className="settings-shell">
            <div className="settings-panel"
                style={{
                    display:"flex",
                    flexDirection:"column",
                    justifyContent: "start",
                    alignItems:"start",
                    flexGrow: 2,
                    padding:"2rem 1rem",
                    
                }}
            >
                <SectionHeader>
                    Settings
                </SectionHeader>
                <SettingsMenuCard title="Manage Shardholders" subtitle="Edit blacklist and add new shardholders"/>
                <SettingsMenuCard title="Manage Identities" subtitle="Cycle keys to a new identity"/>

            </div>

            <div 
                className="settings-widgets"
                style={{
                    display:"flex",
                    flexDirection:"column",
                    alignItems:"center",
                    flexGrow:3,
                    padding: "2rem 1rem"
                }}
            >
                <Switch>
                    <Route exact path="/settings" render={() => <SettingsMenu/>}/>
                    <Route path="/settings/edit-shardholders" render={() => <EditShardholders/>}/>
                </Switch>
            
            </div>

            
        </div>
    )
}


export default SettingsShell;