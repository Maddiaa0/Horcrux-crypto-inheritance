import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// componenets
import {ValidatorForm, TextValidator} from "react-material-ui-form-validator";

export default function RecombineRecovery(props) {
  const {handleResponse} = props;
  const [open, setOpen] = React.useState(false);
  const [privateKey, setPrivateKey] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleRespondClicked = () => {
    if (privateKey === "") return alert("Invalid private key provided");

    // pass back the private key to the previous page
    handleResponse(privateKey);
    handleClose();
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Recombine Selected Shares
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="trigger-recovery-dialog-title"
        aria-describedby="trigger-recovery-dialog-description"
      >
        <DialogTitle id="trigger-recovery-dialog-title">{"Respond to Vault Recovery"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="trigger-recovery-dialog-description">
            By continuing you will reproduce the seed phrase required to access the vault. When completed, pass this phrase to the vault owner and they will
            be able to access their files. 
          </DialogContentText>
          <ValidatorForm >
            <TextValidator
                key="eth-input"           
                type="text"
                variant="outlined"
                placeholder="Enter Private Key"
                value={privateKey}
                onChange={evt => setPrivateKey(evt.target.value)} 
                // validators={ethValidatorMessages.isEthAddress}
                // errorMessages={ethValidatorMessages.isEthErrorMessage}
            />
        </ValidatorForm>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleRespondClicked()} color="primary" autoFocus>
            Recreate Seedphrase
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
