import React from "react";
import "./SettingsManuCard.css";
import PropTypes from "prop-types";

function SettingsMenuCard(props){
    const {onClick, title, subtitle} = props
    return (
        <div 
        onClick={onClick}
        className="Card-wrapper">
            <div className="Icon" >
                O
            </div>
            <div className="Card-info">
                <div className="Card-title">
                    {title}
                </div>
                <div>
                    {subtitle}
                </div>
            </div>
        </div>
    )
}

SettingsMenuCard.propTypes = {
    onClick: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired
};

export default SettingsMenuCard;