import { create } from 'ipfs-http-client'
const client = create('https://ipfs.infura.io:5001')
//import firebase from "firebase"

// prettier-ignore
const uploadMediaIPFS = async (file: file, account: string): Promise<void> => {
	console.log(account)
	//const snapshot = await firebase.firestore().collection('users').doc(account).get();
}

export default uploadMediaIPFS
