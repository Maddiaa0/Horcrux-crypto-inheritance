import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// componenets
import {ValidatorForm, TextValidator} from "react-material-ui-form-validator";

export default function BIP39MoreInfoDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleRespondClicked = () => {
    handleClose();
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
       Click here for information on how to manage and store you backup phrase
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="trigger-recovery-dialog-title"
        aria-describedby="trigger-recovery-dialog-description"
      >
        <DialogTitle id="trigger-recovery-dialog-title">{"Looking after your backup phrase"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="trigger-recovery-dialog-description">
            A seed phrase or recovery phrase is a list of words which store all the information needed to recover access to your account on chain.
            If you lose access to this browser, or you lose your computer, you will be able to import your vault by using this seed phrase.
            <br/>
            You must keep it safe, as anyone who discovers this phrase, will be able to recover your account aswell. You must keep this phrase safe as it is your password to your files!
            <br/><br/>
            <strong>Storing for the long term.</strong>
            <br/>
            <i>Paper and pencil backup</i> - a popular way to store you seed phrase is to write it down on multiple peices of paper,
            backing up that paper in a safe place like a bank vault.
            <br/><br/>
            <i>Mental backup</i> - Memorise this seed phrase
            <br/><br/>
            <i>Social Recovery</i> - This method will be introduced in the next section, you can chose a number of friends or individuals your social circles
            to come together and recover you seed phrase.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleRespondClicked()} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
