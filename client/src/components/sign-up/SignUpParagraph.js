import React from "react";

/**Sign Up Paragraph
 * 
 * Simple text inline paragraph to be used within the sign up section
 * @param {Object} props 
 */
function SignUpParagraph(props){
    return (
        <div style={{
            margin: "10px 0px"
        }}>
            {props.children}
        </div>
    )
}

export default SignUpParagraph;