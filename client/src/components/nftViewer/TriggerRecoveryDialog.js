import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function TriggerRecoveryDialog(props) {
  const {normalRecoveryMethod, deathRecoveryMethod} = props;
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNormalRecoveryClicked = () => {
    normalRecoveryMethod();
    handleClose();
  }

  const handleDeathRecoveryClicked = () => {
      deathRecoveryMethod();
      handleClose();
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Trigger Recovery
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="trigger-recovery-dialog-title"
        aria-describedby="trigger-recovery-dialog-description"
      >
        <DialogTitle id="trigger-recovery-dialog-title">{"Trigger Vault Recovery"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="trigger-recovery-dialog-description">
            Triggering recovery will send a recovery notification to each of the other trustee wallets addresses, in the event a death recovery is required, you 
            may or may not wish to make yourself known to the other trustees to prompt them to respond to this request.
            Triggering a normal recovery will require the vault holder to notify their trustees themselves.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeathRecoveryClicked} color="primary" autoFocus>
            Trigger Death Recovery
          </Button>
          <Button onClick={handleNormalRecoveryClicked} color="primary" autoFocus>
            Trigger Standard Recovery
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
