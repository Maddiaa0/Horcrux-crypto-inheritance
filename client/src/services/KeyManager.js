import { mont } from 'bn.js';
import Crypto from 'crypto'
import CryptoJS from 'crypto-js';
import local from '../config/local';

// Services
import CryptoManager from "./CryptoManager";


/**
 * A service to handle the encryption and storage of passwords inside web sql
 * 
 * Current naive approach will store session info within local storage, there are aims to migrate this to a file stored on the user's pc
 */
class KeyManager {

    constructor(){
        // State variables
        this.mnemonic = null;
        this.currentKeys = null;
        this.privateKey = null;
        this.publicKey = null;

        // bindings
        this.getPasswordHash = this.getPasswordHash.bind(this);
        this.setPasswordhash = this.setPasswordhash.bind(this);
        this.checkPasswordIsValid = this.checkPasswordIsValid.bind(this);
        this.generateSalt = this.generateSalt.bind(this);
        this.hash = this.hash.bind(this);
        this.hasher = this.hasher.bind(this);
        this.comparePassAndHash = this.comparePassAndHash.bind(this);
    }

    /**Generate and Store Mnemonic from password
     * 
     * Create a new BIP39 string and save it to the key manager state.
     * Take the users password and store it and the mnemonic encrypted within storage.
     * @param {String} password 
     */
    async generateAndStoreMnemonicFromPassword(password){
        const mnemonic = CryptoManager.generateMnemomic()
        this.mnemonic = mnemonic

        this.setPasswordhash(password)
        this.storeMnemonicInStorage(mnemonic, password)
        const keys = await CryptoManager.getPublicPrivateKeyAtIndex(this.mnemonic, 1)
        this.currentKeys = keys;
        console.log(keys);
        this.storeKeysInStorage(keys, password);
    }


    /**
     * Request the variable stored as passhash from within the browser
     */
    async getPasswordHash() {
        return await JSON.parse(localStorage.getItem("passHash"));
    }

    setPasswordhash(password){
        let random = Math.floor(Math.random() * 15)
        let salt = this.generateSalt(random);
        let ha = this.hash(password, salt);
        localStorage.setItem("passHash", JSON.stringify(ha));
    }

    checkPasswordIsValid(password){
        let storedPass = this.getPasswordHash();
        return this.comparePassAndHash(password, storedPass);
    }

    generateSalt(rounds) {
        if (rounds >= 15){
            throw new Error(`${rounds} is greater than 1, Must be less than 15`);
        }
        if (typeof rounds !== "number"){
            throw new Error(`${rounds} must be a number`);
        }
        if (rounds == null){
            rounds = 12;
        }

        return Crypto.randomBytes(Math.ceil(rounds /2)).toString("hex").slice(0, rounds);
    }

    /** Hasher
     * 
     * Takes the password and salt and performs a one way hash function, that will allow the password to be stored.
     * 
     * @param {String} password 
     * @param {String} salt 
     */
    hasher(password, salt){
        let hash = Crypto.createHmac("sha512", salt);
        hash.update(password);
        let value = hash.digest("hex");
        return {
            salt: salt,
            hashedPassword: value
        };
    }

    hash(password, salt){
        if (password == null || salt == null){
            throw new Error("Must provide a salt and a value");
        }
        if (typeof password !== "string" || typeof salt !== "string"){
            throw new Error("password and salt must both be strings");
        }
        return this.hasher(password, salt);
    }

    comparePassAndHash(password, hash){
        if (password == null || hash == null){
            throw new Error("Must provide a password and a hash");
        }
        if (typeof password !== "string" || typeof hash !== "object"){
            throw new Error("password must be a string, hash must be an object");
        }
        let passwordData = this.hasher(password, hash.salt);
        return (passwordData.hashedPassword === hash.hashedPassword) ? true : false;
    }


    /** Store Mnomonic in storage
     * 
     * Store the users currently used encrypted mnemonic in local storage for later
     * It is encrypted using the users password 
     * 
    * @param {String} mnemonic 
    * @param {String} password 
    */
    storeMnemonicInStorage(mnemonic, password){
        if (mnemonic == null || password == null){
            throw new Error("Mnemonic and password are both required");
        }
        if (typeof mnemonic !== "string" || typeof password !== "string"){
            throw new Error("Both mnomonic and the password must be strings");
        }

        // first hash the mnemonic with the password
        const encrypted = CryptoJS.AES.encrypt(mnemonic, password);
        localStorage.setItem("mem", encrypted);
    }

    /**Get Mnemonic from storage
     * 
     * 
     * 
     * @param {String} password 
     */
    getMnemonicFromStorage(password){
        if (password == null){
            throw new Error("password is required");
        }
        if (typeof password !== "string"){
            throw new Error("password must be string");
        }

        const encryptedMem = localStorage.getItem("mem");
        const bytes = CryptoJS.AES.decrypt(encryptedMem, password);
        this.mnemonic = bytes.toString(CryptoJS.enc.Utf8);  
        return this.mnemonic;
    }

    storeKeysInStorage(keysObj, password){
        if (password == null){
            throw new Error("Password is required")
        }
        if (typeof password !== "string"){
            throw new Error("password must be string")
        }
        const encryptedKey = CryptoJS.AES.encrypt(JSON.stringify(keysObj), password);
        localStorage.setItem("currKeys", encryptedKey);
    }

    getKeysFromStorage(password){
        if (password == null){
            throw new Error("Password is required")
        }
        if (typeof password !== "string"){
            throw new Error("password must be string")
        }

        const encryptedKey = localStorage.getItem("currKeys")
        const bytes = CryptoJS.AES.decrypt(encryptedKey, password);
        const keys = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));  
        return keys;
    }

}

const keyManager = new KeyManager();
export default keyManager;