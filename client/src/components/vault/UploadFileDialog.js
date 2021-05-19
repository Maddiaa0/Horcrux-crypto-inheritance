import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

// components
import Row from "../Row";
import {ValidatorForm, TextValidator} from "react-material-ui-form-validator";
import {MenuItem, FormControl, Select, InputLabel, Typography, Grid} from "@material-ui/core";

// services
import CASManager from "../../services/CasManager";



export default function RespondToRecoveryDialog(props) {
  // props
  const {setUploadedFileCID, currentPath, uploadFile} = props;


  const [open, setOpen] = React.useState(false);
  const [selectedAccessGroup, setSelectedAccessGroup] = React.useState("");
  const [fileName, setFileName] = React.useState("");
   // file selection state
   const [selectedFile, setSelectedFile] = React.useState(null);
   const inputFile = React.useRef(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleUploadFileClick(evt){
    evt.preventDefault();
      inputFile.button.click();
    }

    function onChangeFileInput(evt){
        const selectedFile = evt.target.files[0];
        console.log("Selected file");
        console.log(selectedFile);
        setSelectedFile(selectedFile);
    }


  const handleRespondClicked = () => {
    addSelectedFileToVault()
    handleClose();
  }
    
  async function addSelectedFileToVault(){

    var isPath = false;
    if (selectedFile == null){
        alert("No file selected");
        return;
    }
    if (typeof selectedFile === "string") isPath = true;
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(selectedFile);
    reader.onloadend = async ()=> {
        uploadFile(fileName, Buffer(reader.result), selectedAccessGroup);
    }  
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Upload File
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="add-file-dialog-title"
        aria-describedby="add-file-dialog-description"
      >
        <DialogTitle id="add-file-dialog-title">{"Upload File"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="add-file-dialog-description">
            Add file to the following path: {currentPath}
          </DialogContentText>
          
              <Grid container spacing={3}>
                {/* <Grid item>
                  <Typography align="center">
                    Title
                  </Typography>
                </Grid> */}
                <Grid item xs={12}>
                  <ValidatorForm >
                    <TextValidator
                        key="eth-input"           
                        type="text"
                        variant="outlined"
                        placeholder="File Name"
                        value={fileName}
                        onChange={evt => setFileName(evt.target.value)} 
                        // validators={ethValidatorMessages.isEthAddress}
                        // errorMessages={ethValidatorMessages.isEthErrorMessage}
                    />
                 </ValidatorForm>
                </Grid>
                <Grid item xs={12}>
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">Access Group</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedAccessGroup}
                        onChange={evt => setSelectedAccessGroup(evt.target.value)}
                        style={{
                          minWidth: "120px"
                        }}
                    >
                        {/* For the sake of simplicity, give each of the following the key values 1 - 2 - 3 */}
                            {CASManager.accessGroups.map(group => <MenuItem value={group.index}>{group.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <input 
                      type="file"
                      ref={inputFile}
                      id="file-upload"
                      onChange={(evt) => onChangeFileInput(evt)}
                  />
                </Grid>
              </Grid>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleRespondClicked()} color="primary" autoFocus>
            Add file
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
