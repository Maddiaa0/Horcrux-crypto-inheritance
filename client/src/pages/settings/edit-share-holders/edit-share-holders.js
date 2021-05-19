import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import AddShardholders from "../../../components/settings/AddShardholders";
import RecoveryContractManager from "../../../services/RecoveryContractManager";

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Emoji from "../../../components/Emoji";
import { Tooltip } from "@material-ui/core";
import AddressBar from "../../../components/settings/address-bar/AddressBar";
import ConfirmDialog from "../../../components/ConfirmDialog";
import SimpleSnackbar from "../../../components/Snackbar";

//TODO: ADD SO THAT IT ACTUALLY GETS IF THE PERSON HAS RECEIVED A SHARD YET!!!!!!! - just check balances are > 1 in the nft contract

function EditShardHolders(){

    const [shardHolders, setShardHolders] = useState(null);

    // controls which shardholders and blacklistees will be highlighted when the user clicks on them
    const [selectedShardholders, setSelectedShardholders] = useState([]);
    const [selectedBlacklist, setSelectedBlacklist] = useState([]);

    // control a snackbar
    const [snackBarOpen, setSnackBarOpen] = useState(false);

    const [sentShardCount, setSendShardCount] = useState(0);

    
    async function getCurrentShardHolders(){
        //todo: remove this for later
        await RecoveryContractManager.getRecoveryContractForAddress("0x2f9B8DcF85414FfEA3AC67503357F9B9d84255A8");
        const shareHolders = await RecoveryContractManager.getShardholders();
        setShardHolders(shareHolders);
        console.log(shareHolders);
    }

    useEffect(() => {
        //TODO: remove this towards production, this is just for random page testing
        getCurrentShardHolders();
    },[]);

    function handleShardholderClick(address){
        if (selectedShardholders.some(addr => addr === address)){
            console.log("removing")
            setSelectedShardholders(selectedShardholders.filter(addr => addr !== address));
        } else {
            setSelectedShardholders([...selectedShardholders, address]);
        }
    }

    function handleBlacklistedClick(address){
        if (selectedBlacklist.some(addr => addr === address)){
            setSelectedBlacklist(selectedBlacklist.filter(addr => addr !== address));
        } else {
            setSelectedBlacklist([...selectedBlacklist, address]);
        }
    }

    /**Add Addresses to Blacklist
     * 
     * Takes the selected shardholders and adds them to the user's contract blacklist
     */
    function addAddressesToBlacklist(){

        // convert into an array of strings
        if (selectedShardholders.length < 1){
            // show a snack bar saying that not enough shareholders were selected
            setSnackBarOpen(true);
        } else {
            RecoveryContractManager.batchBlacklistShardholder(selectedShardholders);  
        }
    }

    /**Remove Addresses from blacklist
     * 
     * Takes the selected blacklistees and removes them from the current user's blacklist
     */
    function removeAddressesFromBlacklist(){
        // convert into an array of string
        console.log(selectedBlacklist)

        if (selectedBlacklist.length < 1){
            // show a snack bar saying that not enough shareholders were selected
            setSnackBarOpen(true);
        } else {
            RecoveryContractManager.batchRemoveBlacklistShardholder(selectedBlacklist);
            
        }
    }

    /**
     * 
     */
    async function sendShardsToSelectedHolders(){
        // todo: remove from this testing state, just checking the currently selected transaction
        if (selectedShardholders.length < 1) {
            alert("No shardholder selected");
            return;
        }

        // for each of the selected, send them a shard!!
        //TODO: CHANGE THIS FROM i BEING THE VALUE PASED IN FOR THE SHARD INDEX
        // for (let i =0; i< selectedShardholders.length; i++){
        await RecoveryContractManager.recoverPublicKeyFromUser(selectedShardholders[0], sentShardCount);
        setSendShardCount(sentShardCount+ 1);
        // }
    }

    function openSnackbar(){
        setSnackBarOpen(true);
    }

    function closeSnackbar(){
        setSnackBarOpen(false);
    }

    return (
        <div>
            <Typography>
                Recovery Contract Address - {RecoveryContractManager.recoveryContractAddress}
            </Typography>
            <Typography>
                NFT Address - {RecoveryContractManager.nftContractAddress}
            </Typography>
            Edit Shardholders
            <SimpleSnackbar open={snackBarOpen} message="No Address Selected" handleClose={closeSnackbar}/>
            <Card variant="outlined" style={{margin:"10px"}}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Shardholders
                    </Typography>
                    <div>
                        {shardHolders == null ? 
                            (<div>Loading</div>) :
                            shardHolders.shardholder.map(shardholder => 
                                <AddressBar 
                                    addressData={shardholder} 
                                    selected={selectedShardholders.some(i=> i===shardholder.address)} 
                                    onClick={() => handleShardholderClick(shardholder.address)}    
                                />
                            )
                        }
                    </div>
                </CardContent>
                <CardActions>
                    <ConfirmDialog 
                        size="small" 
                        title="Add Selected Addresses to your blacklist?" 
                        boxText="Adding an address to your blacklist will disable them from being able to perform recovery operations, do you wish to continue?"
                        buttonText="Add to Blacklist"
                        onConfirmed={addAddressesToBlacklist}
                    />
                    <Tooltip arrow title="Only verified shareholders can be sent shards" placement="top">
                        <Button size="small" variant="contained" onClick={() => sendShardsToSelectedHolders()}>Send Shard</Button>
                    </Tooltip>
                </CardActions>
            </Card>

            <Card variant="outlined" style={{margin:"10px"}}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Blacklisted
                    </Typography>
                    <div>
                        {shardHolders == null ? 
                            (<div>Loading</div>) :
                            shardHolders.blacklisted.map(blacklist => 
                                <AddressBar addressData={blacklist} selected={selectedBlacklist.some(i => i===blacklist.address)} onClick={() => handleBlacklistedClick(blacklist.address)}/>
                            )}
                    </div>
                </CardContent>
                <CardActions >
                    <ConfirmDialog 
                        size="small" 
                        title="Remove Selected Addresses to your blacklist?" 
                        boxText="Removing an address from your blacklist will enable them to perform recovery operations, do you wish to continue?"
                        buttonText="Remove from Blacklist"
                        onConfirmed={removeAddressesFromBlacklist}
                    />
                </CardActions>
            </Card>

            <div>
                Add more Shardholders
                <AddShardholders/>
            </div>
        </div>
    )
}

export default EditShardHolders;