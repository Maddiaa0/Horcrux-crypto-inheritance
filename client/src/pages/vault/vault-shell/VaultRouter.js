import React from "react";
import {Switch, Route} from "react-router-dom";
import CreateDataVault from "../create-data-vault/CreateDataVault";
import UploadToVault from "../file-upload/UploadToVault";

/**Vault Router
 * 
 * NOTE: 1. files can be uploaded for a specific purpose. 
 * 
 * Manage the pages within the vault directory which are responsible for the upload and adding of files to the user's
 * datavault.
 */
function VaultRouter(){
    return (
        <Switch>
            <Route exact path="/vault" render={() => <UploadToVault/>}/>
            <Route path="/vault/create" render={() => <CreateDataVault/>}/>
        </Switch>
    )
}

export default VaultRouter;