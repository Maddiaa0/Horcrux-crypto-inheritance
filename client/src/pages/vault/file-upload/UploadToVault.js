import React, {useState, useRef} from "react";
import CASManager from "../../../services/CasManager";


function UploadToVault(){
    // file selection state
    const [selectedFile, setSelectedFile] = useState(null);
    const inputFile = useRef(null);

    // file retreival state
    const [uploadedFileCID, setUploadedFileCID] = useState(null);

    function handleUploadFileClick(evt){
        evt.preventDefault();
        inputFile.button.click();
    }

    function onChangeFileInput(evt){
        const selectedFile = evt.target.files[0];
        console.log("Selected file");
        console.log(selectedFile);
        setSelectedFile(selectedFile);
    }


    async function addSelectedFileToVault(){
        var isPath = false;
        if (selectedFile == null){
            alert("No file selected");
            return;
        }
        if (typeof selectedFile === "string") isPath = true;
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onloadend = async ()=> {
            console.log(Buffer(reader.result));
            const CID = await CASManager.addFileToIPFS("/testPath", Buffer(reader.result), "test", false);
            setUploadedFileCID(CID);

            alert("file CID" + CID);
        }
        
    }

    // This is only for testing purposes!
    async function requestFileFromVault(){
        const cid = "QmYVkBo29VmCFn857GwdkSd4ZLERhZbg3pnjKnsqELouH6";
        const result = await CASManager.getFileFromIPFS(cid);


    }



    return (
        <>
            <div>
                <input 
                    type="file"
                    ref={inputFile}
                    id="file-upload"
                    onChange={(evt) => onChangeFileInput(evt)}
                />
              {/* <button
                    id="file-upload-button"
                    onClick={(evt) => handleUploadFileClick(evt)}
                > 
                    Upload file
                </button> */}
                <button onClick={(evt) => addSelectedFileToVault()}>Add file to data store</button>

                <button onClick={() => requestFileFromVault()}>Get file from IPFS</button>
            </div>
        </>
    )
}

export default UploadToVault;