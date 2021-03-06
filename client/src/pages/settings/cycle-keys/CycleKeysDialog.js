import React, {useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from "prop-types";
import Emoji from "../../../components/Emoji"
import RecoveryContractManager from '../../../services/RecoveryContractManager';
import EthDIDManager from '../../../services/EthDIDManager';

const updateStage = {
    BEGINNING: "beginning",
    UPDATE_TRIGGERED:"did_update_triggered",
    UPDATE_REJECTED: "did_update_rejected",
    UPDATE_SUCCEEDED: "did_update_succeeded",
};

//TODO: Move the convert keys bit to be a call made from a contract, that way - the operation is atomic

function CycleKeysDialog(props) {
  const [open, setOpen] = React.useState(false);

  const [didUpdateStage, setDIDUpdateStage] = useState(updateStage.BEGINNING);
  const [recoveryUpdateStage, setRecoveryUpdateStage] = useState(updateStage.BEGINNING);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmedClicked = () => {
    //   props.onConfirmed();

    // TODO: switch this to a BIP32 new address implementation
    // const newAddress = "0x21f754eF0aDb6279b03d2a2821a8FA667779FE06";
    const newAddress = "0x3341455C984441D730738cad896BcFe9A01D0cce";

    if (didUpdateStage == updateStage.UPDATE_TRIGGERED || didUpdateStage == updateStage.UPDATE_SUCCEEDED){
        // Pressing the confirm button will now trigger the registry change
        if (recoveryUpdateStage === updateStage.BEGINNING){
            RecoveryContractManager.transferOwnerShip(newAddress, function(result){
                if (result) setRecoveryUpdateStage(updateStage.UPDATE_SUCCEEDED);
                else setRecoveryUpdateStage(updateStage.UPDATE_REJECTED);
            });
            setRecoveryUpdateStage(updateStage.UPDATE_TRIGGERED);
        }
    }
    else {
        switch (didUpdateStage){
            case updateStage.BEGINNING:{
                // trigger the did update
                EthDIDManager.transferOwnerShipToNewAddress(newAddress, function(result){
                    if (result) setDIDUpdateStage(updateStage.UPDATE_SUCCEEDED);
                    else setDIDUpdateStage(updateStage.UPDATE_REJECTED);
                });
                setDIDUpdateStage(updateStage.UPDATE_TRIGGERED);
                break;
            }
            case updateStage.UPDATE_TRIGGERED : {
                alert("Updating your DID controller address has already been triggered");
            }
            default:{
                // TODO: Do something for when the update was rejected
                alert("Update has already been triggered");
            }
        }
    }

    //   handleClose();
  }

  const whichUpdateStateEmojiToShow= updateState=>{
    var emoji = "";
    switch(updateState){
        case updateStage.BEGINNING:{
            emoji = "";
            break;
        }
        case updateStage.UPDATE_TRIGGERED:{
            emoji = "⌛";
            break;
        }
        case updateStage.UPDATE_REJECTED:{
            emoji = "❌";
            break;
        }
        case updateStage.UPDATE_SUCCEEDED:{
            emoji="✔️";
            break;
        }
        default:{
            break;
        }
    }
        return <Emoji symbol={emoji} label="update stage progress indicator"/>
    }   

    function getButtonText(){
        switch (didUpdateStage){
            case updateStage.BEGINNING: {
                return "Update DID";
            }
            default :{
                switch (recoveryUpdateStage){
                    case updateStage.BEGINNING:{
                        return "Update Recovery"
                    }
                    default:{
                        return "Confirm"
                    }
                }
            }
        }
    }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
            Cycle To New Address
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Cycle to New Address</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <br/>
                {whichUpdateStateEmojiToShow(didUpdateStage)}Update DID to a your new address
            <br/>
                {whichUpdateStateEmojiToShow(recoveryUpdateStage)}Update the Recovery contract to your new address
            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmedClicked} color="primary" autoFocus>
            {getButtonText()}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CycleKeysDialog;