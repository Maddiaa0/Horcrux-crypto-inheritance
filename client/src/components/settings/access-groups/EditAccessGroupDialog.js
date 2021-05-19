import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// componenets
import {ValidatorForm, TextValidator} from "react-material-ui-form-validator";

export default function AddAccessDialog(props) {
  const {handleAddAccessGroup} = props;
  const [open, setOpen] = React.useState(false);
  const [newGroup, setNewGroup] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const handleRespondClicked = () => {
    if (newGroup === "") return alert("Invalid private key provided");

    // pass back the private key to the previous page
    handleAddAccessGroup(newGroup);
    handleClose();
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add Group
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="add-access-dialog-title"
        aria-describedby="add-access-dialog-description"
      >
        <DialogTitle id="add-access-dialog-title">{"Add name of access group"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="add-access-dialog-description">
            Enter the name of the group you wish to add
          </DialogContentText>
          <ValidatorForm >
            <TextValidator
                key="eth-input"           
                type="text"
                variant="outlined"
                placeholder="Enter Group Name"
                value={newGroup}
                onChange={evt => setNewGroup(evt.target.value)} 
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
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
