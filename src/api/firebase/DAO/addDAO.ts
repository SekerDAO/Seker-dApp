import {DAO} from "../../../types/DAO"
import firebase from "firebase"

const addDAO = async (
	{
		address,
		name,
		type,
		houseTokenType,
		tokenAddress,
		totalSupply,
		members,
		decisionMakingSpeed,
		votingThreshold,
		tax,
		minProposalAmount
	}: Omit<DAO, "estimated">,
	account: string
): Promise<void> => {
	await firebase
		.firestore()
		.collection("DAOs")
		.doc(address)
		.set({
			name,
			type,
			houseTokenType,
			tokenAddress,
			totalSupply,
			decisionMakingSpeed,
			votingThreshold,
			estimated: new Date().toISOString(),
			...(tax ? {tax} : {}),
			minProposalAmount,
			owner: account
		})
	for (const member of members) {
		await firebase.firestore().collection("daoUsers").add({
			dao: address,
			address: member.address,
			memberSince: new Date().toISOString(),
			role: member.role
		})
	}
}

export default addDAO
