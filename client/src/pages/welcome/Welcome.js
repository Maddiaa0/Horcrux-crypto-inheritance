import React from "react";

// components
import {Button} from "@material-ui/core";

// css
import "./Welcome.css";

/**Welcome
 * 
 * The welcome page for the applicaiton, the landing page that will direct user's through the process
 */
export default function Welcome(props){
    console.log("rendering welcome page")
    function Heading(){
        return <div style={{fontSize: "20px"}}>{props.children}</div>
    }


    return (
        <div className="frame">  
            <div className="left-column">
                <div className="heading">Crypto Vault</div>
                <div className="verify">
                    <Button  variant="contained">Verify</Button>
                </div>
                <div className="go-to-recovery">
                    <Button variant="contained">Activate Recovery</Button>
                </div>
                
            </div>
            <div className="right-column">
                <div className="verify">somehting else</div>something in here
            </div>
            
        </div>
    )
}