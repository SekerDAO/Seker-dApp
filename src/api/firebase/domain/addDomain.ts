import firebase from "firebase"

const addDomain = async (
	name: string,
	symbol: string,
	address: string,
	account: string
): Promise<void> => {
	await firebase
		.firestore()
		.collection("domains")
		.doc(address.toLowerCase())
		.set({name, symbol, address, owner: account})
}

export default addDomain
