import firebase from "firebase"

const addERC20Token = async (
	name: string,
	symbol: string,
	address: string,
	totalSupply: number,
	account: string
): Promise<void> => {
	await firebase
		.firestore()
		.collection("ERC20Tokens")
		.doc(address.toLowerCase())
		.set({name, symbol, totalSupply, address, owner: account})
}

export default addERC20Token
