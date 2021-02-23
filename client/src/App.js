import React from 'react';
import {Switch, Route} from "react-router-dom";
import GettingStarted from './pages/sign-up-flow/getting-started/Getting-Started';

// import pages
import Welcome from './pages/sign-up-flow/welcome-page/Welcome';

/**
 * App
 * 
 * Acts as a general switch board for the rest of the application
 */
function App(){
    return (
        <div className="App">
            <Switch>
                {/* For current test purpsoes */}
                <Route path="/" render={() => <GettingStarted/>}/>

                {/* Perform general onboarding  */}
                {/* <Route path="/signup" render={() => <SignUpView/>}/> */}

                {/* Check if a user is already logged in, if so, route them to home, otherwise to signup */}
                {/* <Route exact path="/" render={() => <HandlePathing />} /> */}
            </Switch>
        </div>
    );
}

export default App;