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
	}: DAO,
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
			members: members.map(m => ({...m, memberSince: new Date().toISOString()})),
			decisionMakingSpeed,
			votingThreshold,
			...(tax ? {tax} : {}),
			minProposalAmount,
			owner: account
		})
}

export default addDAO
