import { Button, Card, CardActions, CardContent, Tooltip, Typography } from "@material-ui/core"
import React, {useState, useEffect} from "react"
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator"
import {useHistory} from "react-router-dom"

import ConfirmDialog from "../../../components/ConfirmDialog"
import SimpleSnackbar from "../../../components/Snackbar";
import RecoveryContractManager from "../../../services/RecoveryContractManager"
import CycleKeysDialog from "./CycleKeysDialog"


/**The purpsose of this page is to cycle the controlling DID to a new ethereum address
 * 
 * The DID will be cycled to a new address aswell as the recovery contract being cycled to a new address also 
 */
function CycleKeys(){

    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const closeSnackbar = () => setSnackBarOpen(false);

    //TODO: remove this for after testing!
    useEffect(() => {
        async function getRecovery(){
            await RecoveryContractManager.getRecoveryContractForAddress("0x3341455C984441D730738cad896BcFe9A01D0cce");
        }
        getRecovery();
    })
    
    return (
        <div>
            Cycle Keys
            <div>
                If you feel you feel your current address has been compromised, you can cycle your keys to a new set to prevent another an attacker
                having access to your account
            </div>
            Edit Shardholders
            <SimpleSnackbar open={snackBarOpen} message="No Address Selected" handleClose={closeSnackbar}/>
            <Card variant="outlined">
            
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        New Address
                    </Typography>
                    <Typography>
                        Click the button below to automatically cycle your keys to a new account.
                    </Typography>
                    <Typography>
                        This will perform two transactions 
                        <ul>
                            <li>
                                Update DID to a your new address
                            </li>
                            <li>
                                Update the Recovery contract to your new address
                            </li>
                        </ul>
                    </Typography>
                </CardContent>
                <CardActions>
                    {/* <Tooltip arrow title="New Addresses will be generated for you" placement="top"> */}
                        <CycleKeysDialog
                            size="small" 
                            onConfirmed={() => setSnackBarOpen(false)}
                        />
                    {/* </Tooltip> */}
                </CardActions>
            </Card>

            <Card variant="outlined">
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Cycle Recovery Keys
                    </Typography>
                    <Typography>
                        If you believe that your recovery seed has been compromised, or if you have just performed social recovery 
                        you can cycle your recovery seed
                    </Typography>
                    <Typography>
                        Note: If this is done, you will need to re-delegate your recovery addresses and re-encrypt your entire vault.
                    </Typography>
                </CardContent>
                <CardActions >
                    <ConfirmDialog 
                        size="small" 
                        title="Remove Selected Addresses to your blacklist?" 
                        boxText="Removing an address from your blacklist will enable them to perform recovery operations, do you wish to continue?"
                        buttonText="Cycle entire recovery keys"
                        onConfirmed={() => setSnackBarOpen(false)}
                    />
                </CardActions>
            </Card>

        </div>
    )
}

export default CycleKeys;