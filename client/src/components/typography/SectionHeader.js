import React from "react";

function SectionHeader(props){
    return (
        <div style={{
            fontSize: 32,
            fontWeight: "bolder"
        }}>
            {props.children}
        </div>
    )
}

export default SectionHeader;