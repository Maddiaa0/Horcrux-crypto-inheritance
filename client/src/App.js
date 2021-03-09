import React, {useEffect} from 'react';
import {Switch, Route} from "react-router-dom";
import ConfirmBIP39Phrase from './pages/sign-up-flow/confirm-bip39-phrase/Confirm-Bip39-Phrase';
import CreateBIP39 from './pages/sign-up-flow/create-bip39-phrase/CreateBIP39';
import GettingStarted from './pages/sign-up-flow/getting-started/Get-Password';
import InitSocialRecovery from './pages/sign-up-flow/init-social-recovery/InitSocialRecovery';
import OnboardingShell from './pages/sign-up-flow/onboarding-shell/onboarding-shell';
import SettingsShell from "./pages/settings/settings-shell/Settings-Shell";
import getWeb3 from './getWeb3';

// import pages
import Welcome from './pages/sign-up-flow/welcome-page/Welcome';
import recoveryContractManager from './services/RecoveryContractManager';
import web3Service from './services/Web3Service';
import VerifyPage from './pages/verify-page/VerifyPage';

// import drizzleOptions from "./drizzleOptions";
// import {Drizzle} from "@drizzle/store";
// import {drizzleReactHooks} from "@drizzle/react-plugin";
import CreateDataVault from './pages/vault/create-data-vault/CreateDataVault';
import VaultRouter from './pages/vault/vault-shell/VaultRouter';


// const drizzle = new Drizzle(drizzleOptions);
// const {DrizzleProvider} = drizzleReactHooks;

/**
 * App
 * 
 * Acts as a general switch board for the rest of the application
 */
function App(){
    
    // useEffect(() => {
    //     const web3 = getWeb3();
    //     // provide web3 for all required services
    //     web3Service.initWeb3(web3);
    // }, []);

    return (
        <div className="App">
            {/* <DrizzleProvider drizzle={drizzle}> */}
                <Switch>
                    {/* For current test purpsoes */}
                    <Route path="/setup" render={() => <OnboardingShell/>}/>

                    {/* For the settings tab*/}
                    <Route path="/settings" render={() => <SettingsShell/>}/>

                    {/* Vault stuff */}
                    <Route path="/vault" render={() => <VaultRouter/>}/>

                    {/* For when a user wishes to verify themselves as a trustee */}
                    <Route path="/verify" render={() => <VerifyPage/>}/>

                    {/* For testing creating the vault */}
                    <Route path="/create-vault" render={() => <CreateDataVault/>}/>

                    {/* Perform general onboarding  */}
                    {/* <Route path="/signup" render={() => <SignUpView/>}/> */}

                    {/* Check if a user is already logged in, if so, route them to home, otherwise to signup */}
                    {/* <Route exact path="/" render={() => <HandlePathing />} /> */}
                </Switch>
            {/* </DrizzleProvider> */}
        </div>
    );
}

export default App;