import React from "react";
import "./SettingsManuCard.css";


function SettingsMenuCard(props){

    return (
        <div className="Card-wrapper">
            <div className="Icon" >
                O
            </div>
            <div className="Card-info">
                <div className="Card-title">
                    {props.title}
                </div>
                <div>
                    {props.subtitle}
                </div>
            </div>
        </div>
    )
}

export default SettingsMenuCard;