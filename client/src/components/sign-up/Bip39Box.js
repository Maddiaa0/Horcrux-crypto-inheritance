import React, {useState} from "react";

function Bip39Box(props){
    var phrase = "";
    if (props.phrase !== undefined) phrase = props.phrase; 

    const [isBlurred, setIsBlurred] = useState(true);

    return (
        <div className="bip39box-wrapper" onClick={() => setIsBlurred(!isBlurred)}>
            <div className={`bip39box-clear ${isBlurred ? "bip39box-blurred" : ""}`}>
                {phrase.split(" ").map(word => <div className="bip39-word">{word}</div>)}
            </div>
        </div>
    )
}

export default Bip39Box;