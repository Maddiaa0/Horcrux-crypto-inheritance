import { Button, Card, CardActions, CardContent, Tooltip, Typography } from "@material-ui/core"
import React, {useState, useEffect} from "react"
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator"
import {useHistory} from "react-router-dom"

import ConfirmDialog from "../../../components/ConfirmDialog"
import AddAccessDialog from "../../../components/settings/access-groups/EditAccessGroupDialog"
import SimpleSnackbar from "../../../components/Snackbar";
import CASManager from "../../../services/CasManager"
import RecoveryContractManager from "../../../services/RecoveryContractManager"

/**Allow the user to store and edit access groups, these will be managed within a file in the root of the textile directory 
 */
function EditAccessGroups(){

    const [snackBarOpen, setSnackBarOpen] = useState(false);
    const [toggleGetGroups, setToggleGetGroups] = useState(false);
    const [accessGroups, setAccessGroups] = useState(CASManager.accessGroups);
    const closeSnackbar = () => setSnackBarOpen(false);

    //TODO: remove this for after testing!
    useEffect(() => {
        getAccessGroups();
    },[]);


    async function getAccessGroups(){
        const rootPath = await CASManager.getAccessGroups();
    }

    async function addAccessGroup(groupName){
        await CASManager.addAccessGroup(groupName);
        setAccessGroups(CASManager.accessGroups);
    }

    
    return (
        <div>
            <Typography variant="h5">Edit Access</Typography>
            <Typography>
                Here you can edit who can access which of your files when your vault is recovered after your death.
            </Typography>
            <Typography>
                When one of your trutees recovers your vault, they will be prompted to provide keys to each of your access groups. Titles can be general: such as lawyer, or family. Such that 
                your trustee will fully understand which keys to provide. Or they can be targeted at specific people - such as your brothers name. 
            </Typography>
            <SimpleSnackbar open={snackBarOpen} message="No Address Selected" handleClose={closeSnackbar}/>
            <Card variant="outlined" style={{margin:"10px"}}>
            
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Current Groups
                    </Typography>
                    <Typography>
                        Here are the current access groups you have assigned
                    </Typography>
                    <Typography>
                        <ul>
                            {CASManager.accessGroups.map(group => <li>{group.name}</li>)}
                        </ul>
                    </Typography>
                </CardContent>
                <CardActions>
                    <AddAccessDialog handleAddAccessGroup={addAccessGroup}/>
                </CardActions>
            </Card>


        </div>
    )
}

export default EditAccessGroups;