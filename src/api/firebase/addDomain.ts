import firebase from "firebase"

const addDomain = async (name: string, symbol: string, account: string): Promise<void> => {
	await firebase.firestore().collection("domains").add({name, symbol, owner: account.toUpperCase()})
}

export default addDomain
