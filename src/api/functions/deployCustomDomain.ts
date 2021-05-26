import {JsonRpcSigner} from "@ethersproject/providers"
import artToken from "../abis/ArtToken.json"
import {ContractFactory} from "@ethersproject/contracts"
import firebase from "firebase"

// prettier-ignore
const deployCustomDomain = async (name: string, symbol: string, signer: JsonRpcSigner, account: string): Promise<void> => {
	// const factory = new ContractFactory(artToken.abi, artToken.bytecode, signer)
	// const contract = await factory.deploy(name, symbol)
	// await contract.deployed()
	console.log(account)
	const snapshot = await firebase.firestore().collection('users').doc(account).get();
}

export default deployCustomDomain
