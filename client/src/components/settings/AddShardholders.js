import React, {useState, useEffect} from "react";

// styles 
import "./AddShardholders.css";

// components
import {ValidatorForm, TextValidator} from "react-material-ui-form-validator";
import Row from "../Row";
import Column from "../Column";
import SignUpParagraph from "../sign-up/SignUpParagraph";
import {Button, Card, Tooltip} from "@material-ui/core";

// constants
import {ethValidatorMessages} from "../../helpers/constants/error-messages";

// services
import RecoveryContractManager from "../../services/RecoveryContractManager";
// helpers
import {isEthereumAddress} from "../../helpers/utils/utils";

function AddShardholders(){

    const [shareHolders, setShareHolders] = useState([{address: ""}]);

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
        //TODO: this is a temporary measure to prevent problems while testing
        RecoveryContractManager.getRecoveryContractForAddress("0x3341455C984441D730738cad896BcFe9A01D0cce");

        ValidatorForm.addValidationRule("isEthAddress", (value) => {
            return (isEthereumAddress(value));
          });
    }, []);

    const addSelectedShardholders = evt => {
        evt.preventDefault();
        const toBeShardholders = shareHolders.map(elem => elem.address);

        if (toBeShardholders.length > 1){
            RecoveryContractManager.batchAddShardholders(toBeShardholders);
        } else {
            RecoveryContractManager.singleAddShareholder(toBeShardholders[0]);
        }
    }

    return (
        <Card variant="outlined" style={{
            padding: "2rem"
        }}>
            <ValidatorForm onSubmit={addSelectedShardholders}>
                <div className="ethaddress-container">
                    
                    {shareHolders.map((shareholder, index) => (
                        <div 
                            className="shareHolder"
                        >
                            <Row>
                                <TextValidator
                                    key={`shareholderInput-${index}`}            
                                    type="text"
                                    variant="outlined"
                                    placeholder={`Eth Address #${index + 1}`}
                                    value={shareholder.address}
                                    onChange={handleShareHolderNameChange(index)} 
                                    validators={ethValidatorMessages.isEthAddress}
                                    errorMessages={ethValidatorMessages.isEthErrorMessage}
                                />
                                <Tooltip 
                                    title="Remove address entry box"
                                    placement="top"
                                    arrow
                                >    
                                    <Button
                                        key={`remove-shareholder-${index}`}
                                        variant="contained"
                                        type="button"
                                        onClick={handleRemoveShareholder(index)}
                                    >
                                        x
                                    </Button>
                                </Tooltip>
                            </Row>
                        </div>
                        )
                    )}
                </div>

                <SignUpParagraph>
                    Your trustees are required to send a registration transaction to an address that will be shown to you shortly.
                    <br></br>
                    If they can not register using this address then they will not be able to initiate recovery.
                    <br></br>
                    Instructions to initialise recovery will be provided soon.
                </SignUpParagraph>
                    

                <div className="ethaddress-button-row">
                    <div className="ethaddress-button">
                        <Button  type="button" variant="contained" onClick={handleAddShareHolder}>
                            Add Shareholder
                        </Button>
                    </div>
                    <div className="ethaddress-button">
                        <Button 
                            className="ethaddress-button" 
                            type="submit" 
                            variant="contained"
                        >
                            Continue
                        </Button>
                    </div>
                </div>
            </ValidatorForm>
        </Card>
    );
}

export default AddShardholders;