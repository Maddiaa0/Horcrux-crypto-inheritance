import {atom} from "recoil";

/**
 * This file will contain atoms used by recoil state that relate to passwords, etc.
 */
export const passwordState = atom({
    key: "passwordState",
    default: ""
});

export const bip39State = atom({
    key: "bip39State",
    default: ""
});