import React from 'react';
import {Button, IconButton} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import DeleteIcon from '@material-ui/icons/Delete';

export default function RemoveFileDialog(props) {
  const {fileName, removeFile}=  props;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemoveClicked = () => {
    removeFile();
    handleClose();
  }

  return (
    <div>
      <IconButton variant="outlined" color="primary" onClick={handleClickOpen}>
        <DeleteIcon/>
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="remove-file-dialog-title"
        aria-describedby="remove-file-dialog-description"
      >
        <DialogTitle id="remove-file-dialog-title">{`Remove ${fileName}`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="remove-file-dialog-description">
            Are you sure you want to remove this file from your vault, this action cannot be undone
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleRemoveClicked} color="primary" autoFocus>
            Confirm Removal
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
