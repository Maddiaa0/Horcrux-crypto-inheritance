import React, {useState, useEffect} from "react";
import { Button, Dialog, DialogTitle, MenuItem, Select, TextField } from "@material-ui/core";
import {useHistory} from "react-router-dom";

// components 
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import SignUpTitle from "../../../components/sign-up/SignUpTitle";
import SignUpParagraph from "../../../components/sign-up/SignUpParagraph";
import AddShardholders from "../../../components/settings/AddShardholders";
import Row from "../../../components/Row";

// helpers
import {isEthereumAddress} from '../../../helpers/utils/utils';
import RecoveryContractManager from "../../../services/RecoveryContractManager";

// error messages
import {ethValidatorMessages} from "../../../helpers/constants/error-messages";

// stlye
import "./InitSocialRecovery.css";



function InitSocialRecovery(){
    // state
    const [numberOfShards, setNumberOfShards] = useState(0);
    const [threshold, setThreshold] = useState(0);

    const shardRange = [...Array(10).keys()];

    const handleSetNumberOfShards = (event) => {
        setNumberOfShards(event.target.value);
    };

    const handleSetThreshold = (event) => {
        setThreshold(event.target.value);
    }

   
    return (
        <div>
            <SignUpTitle>Social recovery</SignUpTitle>
            <SignUpParagraph>
                By opting in to social recovery, a number of delegated Ethereum addresses will receive a shard of you recovery seed!
                <br></br>
                In the event that you lose your recovery seed, or after death, you can instruct your trustees, to combine a number
                <br></br>
                of shares that will reveal to them your recovery seed!
            </SignUpParagraph>

            <Row>
                <div>
                    How many shares do you require be needed to recover your seed phrase?
                </div>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={threshold}
                    onChange={handleSetThreshold}
                >
                    {shardRange.map(i => <MenuItem value={i + 1}>{i + 1}</MenuItem>)}
                </Select>
            </Row>
            


            <div>
                In the input boxes, below, enter the ethereum addresses you wish to currently use as your shard trustees!
            </div>
            <AddShardholders/>
    
        </div>
    )
}


export default InitSocialRecovery;