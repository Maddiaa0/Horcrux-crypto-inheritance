import React, { useContext, useEffect, useState } from 'react';
import getWeb3 from "../../getWeb3";

// components
import {ValidatorForm, TextValidator} from "react-material-ui-form-validator";
import {Button, Card} from "@material-ui/core";


// constants
import {ethValidatorMessages} from "../../helpers/constants/error-messages";

// services
import RecoveryContractManager from "../../services/RecoveryContractManager";
import local from "../../config/local";
import CASManager from "../../services/CasManager";
import TriggerRecoveryDialog from "../../components/nftViewer/TriggerRecoveryDialog";
import RespondToRecoveryDialog from "../../components/nftViewer/RespondToRecoveryDialog";
import RecombineRecovery from "../../components/nftViewer/RecombineRecovery";

// style
import "./ViewNFTs.css"
import cryptoManager from "../../services/CryptoManager";



import PropTypes from 'prop-types';
import {AppBar, Paper} from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import {Menu, Search, Refresh} from '@material-ui/icons';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

// image
import LifeRing from "../../img/life_ring.jpg";
import NotifBell from "../../img/notif_bell.svg";
import Raft from "../../img/raft.png";
import Cross from "../../img/cross.png";



// context 
import Web3Context from "../../web3Context";
import { useHistory } from 'react-router';

const lightColor = 'rgba(255, 255, 255, 0.7)';

const styles = (theme) => ({
  secondaryBar: {
    zIndex: 0,
  },
  menuButton: {
    marginLeft: -theme.spacing(1),
  },
  iconButtonAvatar: {
    padding: 4,
  },
  link: {
    textDecoration: 'none',
    color: lightColor,
    '&:hover': {
      color: theme.palette.common.white,
    },
  },
  button: {
    borderColor: lightColor,
  },
  paper: {
    maxWidth: 936,
    margin: 'auto',
    overflow: 'hidden',
    marginTop: "40px"
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
  nftCard:{
    width: "240px",
    height: "260px",
    margin: "20px",
    display: "flex",
    flexDirection:"column",
    justifyContent:"center",
    alignItems:"center",
    padding: "10px"
  },
  innerCard:{
    display:"flex",
    flexDirection:"column",
    alignItems:"center",
    justifyContent:"space-evenly"
    }
  
});

function ViewNFTs(props) {
  const { classes, onDrawerToggle } = props;

    const [web3, setWeb3] = useState(null);
    const [currentAddress, setCurrentAddress] = useState("");
    const [ethAddress, setEthAddress] = useState("");
    const [linkedNFTs, setLinkedNFTs] = useState({});
    const [nftMetaData, setNFTMetadata] = useState([]);

    const [selectedResponses, setSelectedResponses] = useState([]);

    useEffect(()=>{
        async function set(){
            const localWeb3 = await getWeb3();
            setWeb3(localWeb3);
            setCurrentAddress(localWeb3.currentProvider.selectedAddress);
            console.log(localWeb3.currentProvider.selectedAddress);
        }
        set();

    }, []);


    /**Toggle Selected Responses
     * 
     * Handle the highlighting of the selected nfts to re combine back into the seed phrase
     */
    function toggleSelectedResopnses(index){
        console.log("Toggle");
        (selectedResponses.some(item => item===index))
        ? setSelectedResponses(selectedResponses.filter(item => item!==index))
        : setSelectedResponses([...selectedResponses, index]);
    }

    /**Get NFT List
     * 
     * For the currently logged in user, check which NFTs are in their possession for the address which they are protecting
     */
    async function getNFTList(){
        if (ethAddress === "") return alert("Please enter a valid address");
        const cids = await RecoveryContractManager.getNFTsForAddress(ethAddress, web3.currentProvider.selectedAddress);
        console.log(cids);
        
        // set found NFT's in order to update UI to show found items
        setLinkedNFTs(cids);

        // request the IPFS addresses to retreive the data being represented
        var returnedMetaData = [];
        const keys = Object.keys(cids);
        console.log(keys);
        for (let key = 0; key< keys.length; key++){
            console.log(cids[keys[key]]);
            const metadata = await CASManager.getFileFromCID(cids[keys[key]]);
            returnedMetaData.push(metadata)
        }
        
        setNFTMetadata(returnedMetaData);
        console.log(returnedMetaData);
    }

    /**Trigger recovery for this user
     * 
     * When this event is fired, an NFT will be sent to all other trustees notifying them that recovery has been triggered.
     * This will cost them ether to run - minting as many new NFTs as there are users
     */
    async function triggerRecoveryNormal(){
        // trigger a confirm dialog
        RecoveryContractManager.triggerRecoveryEvent("Normal", ethAddress);
    }

    async function triggerRecoveryDeath(){
        // trigger a confirm dialog
        RecoveryContractManager.triggerRecoveryEvent("Death", ethAddress);
    }

    /**Handle Recovery Notification Response
     * 
     * Get the recovery share and the person to send to and mint them an nft with a recovery share that they can decrypt
     * 
     * @param {String} privateKey 
     * @param {Integer} index 
     */
    async function handleRecoveryNotificationResponse(privateKey, index){
        // get the address to protect from the index of the recovery token being responded to and find the recovery share
        const [recoveryShare] = nftMetaData.filter(data => data.name === "Recovery Share");
        const responseNotification = nftMetaData[index];


        await RecoveryContractManager.sendRecoveryShard(privateKey, ethAddress, responseNotification, recoveryShare);
    }

    async function recombineSelectedShares(privateKey){
        // if (selectedResponses.length < 3) return alert("Number of selected shares does not meet the threshold of 3");

        // IPFS data packets should have already been fetched, use these packets to re-create the original password
        const recoveryShares = nftMetaData.filter(share => share.name === "Recovery Response");
        console.log(recoveryShares);

        // unencrypt each of the recovery shares
        const seedPhrase = await RecoveryContractManager.recombineRecoverySecrets(recoveryShares, privateKey);
        alert(seedPhrase);
    }

  return (
    <React.Fragment>
      <AppBar color="primary" position="sticky" elevation={0}>
        <Toolbar>
          <Grid container spacing={1} alignItems="center">
            <Hidden smUp>
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={onDrawerToggle}
                  className={classes.menuButton}
                >
                  <Menu />
                </IconButton>
              </Grid>
            </Hidden>
            <Grid item xs />
            <Grid item>
              
                {currentAddress}
            
            </Grid>
            <Grid item>
              <IconButton color="inherit" className={classes.iconButtonAvatar}>
                <Avatar src="/static/images/avatar/1.jpg" alt="My Avatar" />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <AppBar
        component="div"
        className={classes.secondaryBar}
        color="primary"
        position="static"
        elevation={0}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={1}>
            <Grid item xs>
              <Typography color="inherit" variant="h5" component="h1">
                {/* THIS SHOULD CHANGE WITH THE USERS */}
                View NFTs
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Paper className={classes.paper}>
      <AppBar className={classes.searchBar} position="static" color="default" elevation={0}>
        <Toolbar>
        <ValidatorForm onSubmit={getNFTList}>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
                <IconButton type="submit">
                    <Search className={classes.block} color="inherit" />
                </IconButton>
            </Grid>
            <Grid item md>
           
             <TextValidator
                 key="eth-input"           
                 type="text"
                 variant="outlined"
                 placeholder="Enter Eth Address"
                 value={ethAddress}
                 onChange={evt => setEthAddress(evt.target.value)} 
             />

             {/* <Button type="submit">View Recovery Shards / Events</Button> */}
         
            </Grid>
            <Grid item>
              <Tooltip title="Reload">
                <IconButton>
                  <Refresh className={classes.block} color="inherit" />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
                {selectedResponses.length > 0 && <RecombineRecovery handleResponse={recombineSelectedShares}/>}
            </Grid>
          </Grid>
          </ValidatorForm>
        </Toolbar>
      </AppBar>
      <div className={classes.contentWrapper}>
      <div>
            {/* Inside here the discovered NFTs will be rendered */}
            {nftMetaData.length > 0 && (
                <div style={{
                    display:"flex",
                    flexDirection:"row"
                }}> 
                    {nftMetaData.map((metadata, index) => {
                        const {name} = metadata;
                        const shardfor = metadata.description.split(" ").slice(-1)[0];
                        return <Card className={classes.nftCard} key={metadata.description}>
                            {name !== "Recovery Response" ?
                            <div className={classes.innerCard}>
                                <img width="120px" height="120px" src={name === "Recovery Share" ? LifeRing: Cross} alt="pic-of-a-lifering"/>

                                <div style={{
                                    display:"flex",
                                    flexDirection:"column",
                                    alignItems:"center"
                                }}>
                                    <div>{name}</div>
                                    <div>{`${metadata.description.split(" ").slice(0,-1).join(" ")}`}</div> 
                                    <div>{`${shardfor.slice(0,10)}...${shardfor.slice(-6,-1)}`}</div>

                                    {/* Options, to trigger recovery for this user? To respond to the recovery notification */}
                                    {metadata.name === "Recovery Share" ? 
                                        <TriggerRecoveryDialog normalRecoveryMethod={triggerRecoveryNormal} deathRecoveryMethod={triggerRecoveryDeath}/> :
                                        <RespondToRecoveryDialog handleResponse={handleRecoveryNotificationResponse} index={index}/>
                                    }
                                </div>
                                

                            </div>
                            :
                                <div className={classes.innerCard} onClick={()=> toggleSelectedResopnses(index)} className={`${selectedResponses.some(item => item===index) ? "Card-highlighted" : "Card"}`}>
                                     <img width="120px" height="120px" src={Raft} alt="pic-of-a-raft"/>
                                    <div style={{
                                        display:"flex",
                                        flexDirection:"column",
                                        alignItems:"center"
                                    }}>
                                        <div>{`${metadata.description.split(" ").slice(0,-1).join(" ")}`}</div> 
                                        <div>{`${shardfor.slice(0,10)}...${shardfor.slice(-6,-1)}`}</div>
                                        <div>{`From ${metadata.sender.slice(0,10)}...${metadata.sender.slice(-6,-1)}`}</div>
                                    </div>
                                  
                                </div>
                            }
                        </Card>})}
                </div>
            )}
        </div>
        {/* <Typography color="textSecondary" align="center">
          No recovery notifications for this account yet! 
        </Typography> */}
      </div>
    </Paper>
    </React.Fragment>
  );
}

ViewNFTs.propTypes = {
  classes: PropTypes.object.isRequired,
  onDrawerToggle: PropTypes.func.isRequired,
};

export default withStyles(styles)(ViewNFTs);

// function ViewNFTs(){
//     const [web3, setWeb3] = useState(null);
//     const [currentAddress, setCurrentAddress] = useState("");
//     const [ethAddress, setEthAddress] = useState("");
//     const [linkedNFTs, setLinkedNFTs] = useState({});
//     const [nftMetaData, setNFTMetadata] = useState([]);

//     const [selectedResponses, setSelectedResponses] = useState([]);

//     useEffect(()=>{
//         async function set(){
//             const localWeb3 = await getWeb3();
//             setWeb3(localWeb3);
//             setCurrentAddress(localWeb3.currentProvider.selectedAddress);
//         }
//         set();

//     }, []);


//     /**Toggle Selected Responses
//      * 
//      * Handle the highlighting of the selected nfts to re combine back into the seed phrase
//      */
//     function toggleSelectedResopnses(index){
//         console.log("Toggle");
//         (selectedResponses.some(item => item===index))
//         ? setSelectedResponses(selectedResponses.filter(item => item!==index))
//         : setSelectedResponses([...selectedResponses, index]);
//     }

//     /**Get NFT List
//      * 
//      * For the currently logged in user, check which NFTs are in their possession for the address which they are protecting
//      */
//     async function getNFTList(){
//         if (ethAddress === "") return alert("Please enter a valid address");
//         const cids = await RecoveryContractManager.getNFTsForAddress(ethAddress, web3.currentProvider.selectedAddress);
//         console.log(cids);
        
//         // set found NFT's in order to update UI to show found items
//         setLinkedNFTs(cids);

//         // request the IPFS addresses to retreive the data being represented
//         var returnedMetaData = [];
//         const keys = Object.keys(cids);
//         console.log(keys);
//         for (let key = 0; key< keys.length; key++){
//             console.log(cids[keys[key]]);
//             const metadata = await CASManager.getFileFromCID(cids[keys[key]]);
//             returnedMetaData.push(metadata)
//         }
        
//         setNFTMetadata(returnedMetaData);
//         console.log(returnedMetaData);
//     }

//     /**Trigger recovery for this user
//      * 
//      * When this event is fired, an NFT will be sent to all other trustees notifying them that recovery has been triggered.
//      * This will cost them ether to run - minting as many new NFTs as there are users
//      */
//     async function triggerRecoveryNormal(){
//         // trigger a confirm dialog
//         RecoveryContractManager.triggerRecoveryEvent("Normal", ethAddress);
//     }

//     async function triggerRecoveryDeath(){
//         // trigger a confirm dialog
//         RecoveryContractManager.triggerRecoveryEvent("Death", ethAddress);
//     }

//     /**Handle Recovery Notification Response
//      * 
//      * Get the recovery share and the person to send to and mint them an nft with a recovery share that they can decrypt
//      * 
//      * @param {String} privateKey 
//      * @param {Integer} index 
//      */
//     async function handleRecoveryNotificationResponse(privateKey, index){
//         // get the address to protect from the index of the recovery token being responded to and find the recovery share
//         const [recoveryShare] = nftMetaData.filter(data => data.name === "Recovery Share");
//         const responseNotification = nftMetaData[index];


//         await RecoveryContractManager.sendRecoveryShard(privateKey, ethAddress, responseNotification, recoveryShare);
//     }

//     async function recombineSelectedShares(privateKey){
//         // if (selectedResponses.length < 3) return alert("Number of selected shares does not meet the threshold of 3");

//         // IPFS data packets should have already been fetched, use these packets to re-create the original password
//         const recoveryShares = nftMetaData.filter(share => share.name === "Recovery Response");
//         console.log(recoveryShares);

//         // unencrypt each of the recovery shares
//         const seedPhrase = await RecoveryContractManager.recombineRecoverySecrets(recoveryShares, privateKey);
//         alert(seedPhrase);
//     }

//     return <div>
//         View NFTs for {currentAddress}
//         <div>

//         <ValidatorForm onSubmit={getNFTList}>
//             <TextValidator
//                 key="eth-input"           
//                 type="text"
//                 variant="outlined"
//                 placeholder="Enter Eth Address"
//                 value={ethAddress}
//                 onChange={evt => setEthAddress(evt.target.value)} 
//                 // validators={ethValidatorMessages.isEthAddress}
//                 // errorMessages={ethValidatorMessages.isEthErrorMessage}
//             />

//             <Button type="submit">View Recovery Shards / Events</Button>
//         </ValidatorForm>

        // <div>
        //     {/* Inside here the discovered NFTs will be rendered */}
        //     {nftMetaData.length > 0 && (
        //         <div>
        //             {nftMetaData.map((metadata, index) => 
        //                 <div key={metadata.description}>
        //                     {metadata.name !== "Recovery Response" ?
        //                     <div>
        //                         <div>{metadata.name}</div>
        //                         <div>{metadata.description}</div>
                                
        //                         {/* Options, to trigger recovery for this user? To respond to the recovery notification */}
        //                         {metadata.name === "Recovery Share" ? 
        //                             <TriggerRecoveryDialog normalRecoveryMethod={triggerRecoveryNormal} deathRecoveryMethod={triggerRecoveryDeath}/> :
        //                             <RespondToRecoveryDialog handleResponse={handleRecoveryNotificationResponse} index={index}/>
        //                         }
                                
        //                     </div>
        //                     :
        //                         <div onClick={()=> toggleSelectedResopnses(index)} className={`${selectedResponses.some(item => item===index) ? "Card-highlighted" : "Card"}`}>
        //                             <div>{metadata.name}</div>
        //                             <div>{metadata.description}</div>
        //                             <div>{`From ${metadata.sender}`}</div>
        //                         </div>
        //                     }
        //                 </div>)}
        //         </div>
        //     )}
        // </div>

//        
            
//         </div>
//     </div>
// }

// export default ViewNFTs;