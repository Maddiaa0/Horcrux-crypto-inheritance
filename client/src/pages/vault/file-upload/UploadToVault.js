import React, {useState, useRef, useEffect} from "react";
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import RefreshIcon from '@material-ui/icons/Refresh';
import CASManager from "../../../services/CasManager";
import UploadFileDialog from "../../../components/vault/UploadFileDialog";
import Axios from "axios";
import axios from "axios";
import RemoveFileDialog from "../../../components/vault/RemoveFileDialog";
import { ArrowBackIos, FolderOpen } from "@material-ui/icons";
import { Card } from "@material-ui/core";

const styles = (theme) => ({
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
  },
  searchBar: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  },
  searchInput: {
    fontSize: theme.typography.fontSize,
  },
  block: {
    display: 'block',
  },
  addUser: {
    marginRight: theme.spacing(1),
  },
  contentWrapper: {
    margin: '40px 16px',
  },
  explorerWrapper:{
      display:"flex",
      flexDirection:"row"
  }
});

function UploadToVault(props) {
  const { classes } = props;
  console.log(CASManager.accessGroups);
   // file retreival state
   const [uploadedFileCID, setUploadedFileCID] = useState(null);
   const [fileStructure, setFileStructure] = useState({});
   const [currentPath, setCurrentPath] = useState("");
   const [folderBeingRendered, setFolderBeingRendered] = useState([]); 

   // Get the file structure of the vaults
   async function requestFileFromVault(){
       // const cid = "QmYVkBo29VmCFn857GwdkSd4ZLERhZbg3pnjKnsqELouH6";
       // const result = await CASManager.getFileFromIPFS(cid);

       // get bucket structure
       const folder = await CASManager.getFilesInPath("/");
       console.log(folder);
       setFileStructure(folder);
       setFolderBeingRendered(folder.item);
   }


   /**
    * 
    */
   async function navigateToClickedFolder(newPath, newFolder){
       // push the clicked on folder to the current path
       setCurrentPath(currentPath.concat("/").concat(newPath));

       // set the new folder as the folder being rendered
       setFolderBeingRendered(newFolder);
   }


   const goBack = async () => {

       // fix the file path
       var splitPath = currentPath.split("/");
       splitPath = splitPath.slice(0,-1);
       // splitPath[splitPath.length-1] = "";
       const remainingPath = splitPath.join("/");
       setCurrentPath(remainingPath);

       // traverse the oringal folder for the correct folder to view based on the set remaining path
       console.log(remainingPath);
       var root = fileStructure.item;
       console.log(root);
       if (remainingPath === "/") return setFolderBeingRendered(root);
       const count = remainingPath.match(new RegExp("/", "g").length);
       
       console.log(count);
       
       // work up to the correct count
       const traversePath = remainingPath.split("/").slice(1);

       for (let i = 0; i < traversePath.length; i++){
           const nextFolder = traversePath[i];
           root.items.forEach(subfile => {
               console.log(subfile.name);
               console.log(subfile);
               if (subfile.name === nextFolder) {
                   root = subfile;
                   console.log("TRUE");
               }
           });
       }
       setFolderBeingRendered(root);

   }

   async function uploadFile(fileName, file, accessNumber){
    console.log(currentPath);
    const CID = await CASManager.addFileToIPFSandTextile(`${currentPath}/${fileName}`, file, fileName, false, accessNumber);
    setUploadedFileCID(CID);
    console.log(CID);

    alert("file CID" + CID);
   }

   // ensure that the CAS manager is installed and running
   useEffect(() => {
       const run = async () => CASManager.initTextileForUser().then((_) => requestFileFromVault());
       run();
   },[]);

  return (
    <Paper className={classes.paper}>
      <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
                <IconButton onClick={goBack}>
                    <ArrowBackIos/>
                </IconButton>
            </Grid> 
            <Grid item>
              <SearchIcon className={classes.block} color="inherit" />
            </Grid>
            <Grid item xs>
              <Typography>
                {currentPath === "" ? "/" : currentPath}
              </Typography>
            </Grid>
            <Grid item>
              <UploadFileDialog currentPath={currentPath} setUploadedFileCID={setUploadedFileCID} uploadFile={uploadFile}/>
              <Button variant="contained" color="primary" className={classes.addUser}>
                Add Folder
              </Button>
              <Tooltip title="Reload">
                <IconButton onClick={requestFileFromVault}>
                  <RefreshIcon className={classes.block} color="inherit" />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className={classes.contentWrapper}>
        
        {/* For rendering the IPFS paths */}
        {(folderBeingRendered !== undefined && folderBeingRendered !== null 
                && folderBeingRendered.items !== undefined) ? <div className={classes.explorerWrapper}>
                {
                Object.keys(folderBeingRendered?.items).map(file => {
                    const subfolder = folderBeingRendered.items[file];
                    if (subfolder.count > 0){
                        return <div 
                            onClick={() => navigateToClickedFolder(subfolder.name, subfolder)}
                        >
                            <RenderFolder folder={subfolder}/>
                        </div>
                    }
                    else{
                        // dont return if the name starts with a . - ref textile seed and accessgroups
                        // (subfolder.name.charAt(0) !== ".") && 
                        return (subfolder.name.charAt(0) !== ".") && <RenderFile key={subfolder.cid} file={subfolder}/>
                    }
                })
            }
        </div> 
        : <Typography color="textSecondary" align="center">
            No files in this folder yet! Add one!
        </Typography>
        }
        
      </div>
    </Paper>
  );
}

UploadToVault.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UploadToVault);


// create a unique object for each file so that it asynchronously downloads the metadata for each file in the background
// and displays the relevant details to the user
function RenderFile(props){
    const {file} = props;


    const [fileMetaData, setFileMetaData] = useState({});
    const [fileRemoved, setFileRemoved] = useState(false);
    const [fileGroup, setFileGroup] = useState(0);

    /**Get File
     * 
     * Request the metadata file of the file being accessed
     * @param {String} cid 
     */
    async function getFile(cid){
        console.log("Running for. ", cid );
        // Axios.get(`http://localhost:8080/ipfs/${cid}`).then(
        Axios.get(`https://bafzbeia2rpgg232n5gjhm45j2scnzkbladrm2kxrbol723eniimp3gnf54.ipns.hub.textile.io${cid}`).then(
        response => {
                if (response.status === 200){
                    setFileMetaData(response.data);
                    console.log(response.data);
                    // get the string of the accessgroup number
                    (response.data.accessGroupNumber ===  3) ? setFileGroup("Lawyer") : setFileGroup("Family") 
                    
                } else console.log(`${cid} request FAILED`)
            }
        );
    }

    /**Handle File Download Click
     * 
     * Download the file being referenced by the textile metadata object
     */
    function handleFileDownloadClick(){
        CASManager.getFileFromIPFS(fileMetaData.cid, fileMetaData.accessGroupNumber).then(result => {
            console.log(result);  
            // create a link for the blob to download
            const url = window.URL.createObjectURL(new Blob([result]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "Filename");

            // append the link to the page
            document.body.appendChild(link);

            // start download
            link.click();

            // remove the link
            link.parentNode.removeChild(link);
        });
    }

    function handleRemoveFileClicked(){
        CASManager.removeFile(fileMetaData.path).then(success => success && setFileRemoved(true));
    }

    // run anytime the file given props changes!
    useEffect(() => {
        // const {cid} = file;
        // console.log("USE EFFECT FIRED FOR ", cid);
        // getFile(cid);
        const {path} = file;
        console.log("USE EFFECT FIRED FOR ", path);
        getFile(path);
        
    }, [file]);


    return (
    !fileRemoved && <>
        <Card style={{
            width: "120px",
            height: "130px",
            margin: "20px",
            display: "flex",
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"center",
            padding: "10px"
        }}>
            <div onClick={handleFileDownloadClick}>
                {fileMetaData !== {} && <div>
                    {"Access: " + fileGroup} 
                </div>}
                <Typography>{file.name}</Typography>
            </div>
            <RemoveFileDialog fileName={file.name} file={file} removeFile={handleRemoveFileClicked}/>
        </Card>
        
    </>);
}


function RenderFolder(props){
    const {folder} = props;

    return (
        <Card style={{
            width: "120px",
            height: "130px",
            margin: "20px",
            display: "flex",
            flexDirection:"column",
            justifyContent:"center",
            alignItems:"center"
        }}>
            <FolderOpen style={{width: "60px", height:"60px"}}/>
            <Typography>
                {folder.name}
            </Typography>
                
        </Card>
    );
}


