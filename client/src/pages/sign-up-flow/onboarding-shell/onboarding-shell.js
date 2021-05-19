import React, {useState} from "react";
import {Route, Switch, useHistory} from "react-router-dom";

import GettingStarted from "../getting-started/Get-Password";
import CreateBIP39 from "../create-bip39-phrase/CreateBIP39";
import InitSocialRecovery from "../init-social-recovery/InitSocialRecovery";
import CreateRecoveryContract from "../init-social-recovery/CreateRecoveryContract";

// style
import "./onboarding-shell.css";
import { AppBar, Avatar, Grid, Hidden, IconButton, Toolbar, Typography } from "@material-ui/core";

const lightColor = 'rgba(255, 255, 255, 0.7)';
const styles = (theme) => ({
    secondaryBar: {
      zIndex: 0,
    },
    
    iconButtonAvatar: {
      padding: 4,
    },
   
    button: {
      borderColor: lightColor,
    },
    paper: {
      maxWidth: 936,
      margin: 'auto',
      overflow: 'hidden',
      marginTop: "40px"
    },
    searchBar: {
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    },
   
    block: {
      display: 'block',
    },
    
    contentWrapper: {
      margin: '40px 16px',
    },
    nftCard:{
      width: "240px",
      height: "260px",
      margin: "20px",
      display: "flex",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center",
      padding: "10px"
    },
    innerCard:{
      display:"flex",
      flexDirection:"column",
      alignItems:"center",
      justifyContent:"space-evenly"
      }
    
  });
  


function OnboardingShell(){

    const classes = styles();

    return (
        <>
         <AppBar color="primary" position="sticky" elevation={0}>
            <Toolbar>
            <Grid container spacing={1} alignItems="center">
            </Grid>
            </Toolbar>
        </AppBar>
        <AppBar
            component="div"
            className={classes.secondaryBar}
            color="primary"
            position="static"
            elevation={0}
        >
            <Toolbar>
            <Grid container alignItems="center" spacing={1}>
                <Grid item xs>
                <Typography color="inherit" variant="h5" component="h1">
                    {/* THIS SHOULD CHANGE WITH THE USERS */}
                    Getting Started
                </Typography>
                </Grid>
            </Grid>
            </Toolbar>
        </AppBar>
        <div className="onboarding-shell">
     
            <Switch>
                <Route exact path="/setup" render={() => <GettingStarted/>}/>
                <Route path="/setup/phrase" render={() => <CreateBIP39/>}/>
                <Route path="/setup/createcontract" render={() => <CreateRecoveryContract/>}/>
                <Route path="/setup/social" render={() => <InitSocialRecovery />}/>
            </Switch>
        </div>
        </>
    )
}


export default OnboardingShell;