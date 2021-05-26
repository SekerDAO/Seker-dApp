import {JsonRpcSigner} from "@ethersproject/providers"
import artToken from "../abis/ArtToken.json" 
import {Contract} from "@ethersproject/contracts"
import firebase from "firebase"

// prettier-ignore
const createNFT = async (account: string, hashes: string[], numberOfEditions: string, nftAddress: string, isCustomDomain: boolean): Promise<void> => {
	//const factory = new ContractFactory(artToken.abi, artToken.bytecode, signer)
	//const contract = await factory.deploy(name, symbol)
	//await contract.deployed()
	console.log(account)
	// store the new nft ids in the database and autopopulate the profile, autp set to private
	const snapshot = await firebase.firestore().collection('users').doc(account).get();
}

export default createNFT
