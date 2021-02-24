import React, {useState, useEffect} from "react";
import { Button, Dialog, DialogTitle, MenuItem, Select, TextField } from "@material-ui/core";
import {useHistory} from "react-router-dom";

// components 
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

// helpers
import {isEthereumAddress} from '../../../helpers/utils/utils';

// error messages
import {ethValidatorMessages} from "../../../helpers/constants/error-messages";


function InitSocialRecovery(){
    // state
    const [numberOfShards, setNumberOfShards] = useState(0);
    const [threshold, setThreshold] = useState(0);
    const [shareHolders, setShareHolders] = useState([{address: ""}]);

    const shardRange = [...Array(10).keys()];

    const handleSetNumberOfShards = (event) => {
        setNumberOfShards(event.target.value);
    };

    const handleSetThreshold = (event) => {
        setThreshold(event.target.value);
    }

    const handleShareHolderNameChange = index => event => {
        const newShareholders = shareHolders.map((shareholder, sindex) => {
            if (index !== sindex) return shareholder;
            return {...shareholder, address: event.target.value}
        })

        setShareHolders(newShareholders);
    }

    const handleRemoveShareholder = index => () =>{
        setShareHolders(shareHolders.filter((shareholder, sindex) => index != sindex ));
    }

    const handleAddShareHolder = () => {
        setShareHolders(shareHolders.concat([{address: ""}]))
    }

    useEffect(() => {
        ValidatorForm.addValidationRule("isEthAddress", (value) => {
            return (isEthereumAddress(value));
          });
    }, [])

    return (
        <div>
            <div>Social recovery</div>
            <div>
                By opting in to social recovery, a number of delegated Ethereum addresses will receive a shard of you recovery seed!
                In the event that you lose your recovery seed, or after death, you can instruct your trustees, to combine a number
                of shares that will reveal to them your recovery seed!
            </div>

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


            <div>
                In the input boxes, below, enter the ethereum addresses you wish to currently use as your shard trustees!
            </div>

            <ValidatorForm>
                {shareHolders.map((shareholder, index) => (
                    <div className="shareHolder">
                        <TextValidator 
                            type="text"
                            placeholder={`Eth Address #${index + 1}`}
                            value={shareholder.address}
                            onChange={handleShareHolderNameChange(index)} 
                            validators={ethValidatorMessages.isEthAddress}
                            errorMessages={ethValidatorMessages.isEthErrorMessage}
                        />
                        <Button
                            type="button"
                            onClick={handleRemoveShareholder(index)}
                        >
                            Remove
                        </Button>
                    </div>
                )
                )}
                <Button onClick={handleAddShareHolder}>Add Shareholder</Button>

                <Button type="submit" variant="contained">Continue</Button>
            </ValidatorForm>

        </div>
    )
}


export default InitSocialRecovery;