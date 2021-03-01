
const ethValidatorMessages = {
    isEthAddress :["isEthAddress"],
    isEthErrorMessage : ["Must be 40 characters long beginning with 0x"]
}

const passwordValidatorMessages = {
    passwordsMatch: ["passwordsMatch", "required"],
    passwordsMatchErrorMessage: ["Passwords do not match", "Field Required"]
}


export {
    ethValidatorMessages,
    passwordValidatorMessages
};