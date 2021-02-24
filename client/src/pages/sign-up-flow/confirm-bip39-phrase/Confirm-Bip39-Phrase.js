import { Button } from "@material-ui/core";
import React, {useState} from "react";
import {useHistory} from 'react-router-dom';

function ConfirmBIP39Phrase(){

    return(
        <div>
            <div>
                Insert logo here
            </div>

            <div>
                Back button
            </div>

            <div>
                Confirm your backup phrase
            </div>

            <div>
                Please select your backup phrase in order to ensure it is correct
            </div>

            <div>
                Backup phrase component
            </div>

            <div>
                The list of the backup phrase characters in a random order
            </div>

            <Button variant="contained">Confirm</Button>
        </div>
    )
}

export default ConfirmBIP39Phrase;