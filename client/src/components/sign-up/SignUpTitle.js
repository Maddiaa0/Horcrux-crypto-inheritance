import React from "react";

/**Sign Up Title
 * 
 * Used during the onboarding phases, used as the main page title for each section
 * @param {Object} props 
 */
function SignUpTitle(props){
    return (
        <div style={{
            fontSize: "24px", 
            fontWeight: "bold",
            margin: "20px 0"
        }}>
            {props.children}
        </div>
    )
}

export default SignUpTitle;