import React from "react";

/**Row
 * 
 * A row that works more similar to the flutter framework
 * 
 * @param {Object} props 
 */
function Row(props){
    var horAlign = "flex-start";
    var verAlign = "flex-start";
    if (props.horizontalAlign) horAlign = props.horizontalAlign;
    if (props.verticalAlign) verAlign = props.verticalAlign; 
    return <div style={{
        display: "flex",
        flexDirection:"row",
        justifyContent: horAlign,
        alignItems: verAlign
    }}>
        {props.children}
    </div>
}

export default Row;