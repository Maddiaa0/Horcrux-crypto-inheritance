import React, {useState, useEffect} from "react";
import {Route, Switch, useHistory} from "react-router-dom";

// style
import "./ImportVault.css";
import { AppBar, Avatar, Button, Grid, Hidden, IconButton, Toolbar, Typography } from "@material-ui/core";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import Column from "../../components/Column";
import { passwordValidatorMessages } from "../../helpers/constants/error-messages";
import keyManager from "../../services/KeyManager";

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
  


function ImportVault(){

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [seedPhrase, setSeedPhrase] = useState("");
    const classes = styles();
    const history = useHistory();

    useEffect(() => {
        ValidatorForm.addValidationRule("passwordsMatch", (value) => {
            return (value !== password);
          });

          ValidatorForm.addValidationRule("required", (value) => {
            return (value !== "");
          });
    }, []);


    function onSubmit(){
        keyManager.importFromMnemonic(seedPhrase, password);
        history.push("/home/vault");
    }

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
                    Import Vault
                </Typography>
                </Grid>
            </Grid>
            </Toolbar>
        </AppBar>
        <div className="onboarding-shell">
        <ValidatorForm onSubmit={onSubmit} >
                <Column>
                    <TextValidator 
                        id="seed-create" 
                        name="seed-create"  
                        label="Import Seed Phrase" 
                        variant="outlined"
                        value={seedPhrase}
                        onChange={(evt) => setSeedPhrase(evt.target.value)}
                    />
                    <TextValidator 
                        id="password-create" 
                        name="password-create"  
                        label="Password" 
                        type="password"
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
                        type="password"
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
        </>
    )
}


export default ImportVault;