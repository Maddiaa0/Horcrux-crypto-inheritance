import React, {useState, useEffect} from "react";
import {useHistory} from "react-router-dom";
import AddShardholders from "../../../components/settings/AddShardholders";
import RecoveryContractManager from "../../../services/RecoveryContractManager";

//TODO:

function EditShardHolders(){

    const [shardHolders, setShardHolders] = useState(null);

    
    async function getCurrentShardHolders(){

        //todo: remove this for later
        await RecoveryContractManager.getRecoveryContractForAddress("0x3341455C984441D730738cad896BcFe9A01D0cce");
        const shareHolders = await RecoveryContractManager.getShardholders();
        setShardHolders(shareHolders);
        console.log(shareHolders);
    }

    useEffect(() => {
        //TODO: remove this towards production, this is just for random page testing
        getCurrentShardHolders();
    },[]);


    return (
        <div>
            Edit Shardholders
            <div className="shardholders">
                Shardholders
                <div>
                    {shardHolders == null ? 
                        (<div>Loading</div>) :
                        shardHolders.shardholder.map(shardholder => 
                            <div>
                                {shardholder}
                            </div>
                        )}
                </div>
            </div>         
            <div className="blacklisted">
                Blacklisted
                <div>
                    {shardHolders == null ? 
                        (<div>Loading</div>) :
                        shardHolders.blacklisted.map(shardholder => 
                            <div>
                                {shardholder}
                            </div>
                        )}
                </div>
            </div>

            <div>
                Add more Shardholders
                <AddShardholders/>
            </div>
        </div>
    )
}

export default EditShardHolders;