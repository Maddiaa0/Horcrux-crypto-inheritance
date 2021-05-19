import React, {useEffect, useState} from 'react';
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
import ViewNFTs from './pages/verify-page/view_NFTs';

import LandingPage from "./pages/welcome/Welcome";
import HomeWrapper from './pages/home/HomeWrapper';

import Web3Context from "./web3Context";
import ImportVault from './pages/import-vault/ImportVault';


// const drizzle = new Drizzle(drizzleOptions);
// const {DrizzleProvider} = drizzleReactHooks;

/**
 * App
 * 
 * Acts as a general switch board for the rest of the application
 */
function App(){
    const [web3, setWeb3] = useState(undefined);
    useEffect(() => {
        const runEffect = async () => {
            const w3 = await getWeb3();
            setWeb3(w3);
        }
        runEffect();
    }, []);

    return (
        <div className="App">
            <Web3Context.Provider value={{web3}}>
            {/* <DrizzleProvider drizzle={drizzle}> */}
                <Switch>
                    {/* Welcome Page */}
                    <Route exact path="/" render={() => <LandingPage/>}/>

                    <Route path="/home" render={() => <HomeWrapper/>}/>

                    {/* For current test purpsoes */}
                    <Route path="/setup" render={() => <OnboardingShell/>}/>

                    {/* For the settings tab*/}
                    <Route path="/settings" render={() => <SettingsShell/>}/>

                    {/* Vault stuff */}
                    <Route path="/vault" render={() => <VaultRouter/>}/>

                    {/* Import Vault */}
                    <Route path="/import" render={() => <ImportVault/>} />

                    {/* For when a user wishes to verify themselves as a trustee */}
                    <Route path="/verify" render={() => <VerifyPage/>}/>

                    {/* For a user who wishes to verify to view their NFTs */}
                    <Route path="/viewnfts" render={() => <ViewNFTs/>}/>

                    {/* For testing creating the vault */}
                    <Route path="/create-vault" render={() => <CreateDataVault/>}/>

                    {/* Perform general onboarding  */}
                    {/* <Route path="/signup" render={() => <SignUpView/>}/> */}

                    {/* Check if a user is already logged in, if so, route them to home, otherwise to signup */}
                    {/* <Route exact path="/" render={() => <HandlePathing />} /> */}
                </Switch>
            {/* </DrizzleProvider> */}
            </Web3Context.Provider>
        </div>
    );
}

export default App;