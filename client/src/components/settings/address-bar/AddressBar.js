import React from "react";
import PropTypes from "prop-types";
import Emoji from "../../Emoji";
import { Tooltip } from "@material-ui/core";

import "./Addressbar.css";

function AddressBar(props){
    const {addressData, onClick, selected } = props;


    return (
        <div onClick={onClick} className={`AddressBar ${selected ? "AddressBar-selected" : ""}`}>
            {addressData.address} 
            {addressData.verified && <Tooltip title="User has confimed they wish to be a shardholder" placement="top" arrow><Emoji symbol="✔️" label="verified"/></Tooltip>} 
            <Tooltip arrow title="User is in possession of shard" placement="top"><Emoji symbol="📬" label="Shard Send"/></Tooltip>
        </div>
    )
}

AddressBar.propTypes = {
    selected: PropTypes.bool.isRequired,
    addressData: PropTypes.object.isRequired,
    onClick: PropTypes.func.isRequired
};

export default AddressBar;