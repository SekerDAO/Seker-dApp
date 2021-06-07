import {DAO} from "../../../types/DAO"
import firebase from "firebase"

const addDAO = async (
	{
		name,
		type,
		houseTokenType,
		tokenAddress,
		totalSupply,
		members,
		decisionMakingSpeed,
		votingThreshold,
		tax,
		minProposalAmount,
		govTokensAwarded
	}: DAO,
	account: string
): Promise<void> => {
	await firebase
		.firestore()
		.collection("DAOs")
		.add({
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
			govTokensAwarded,
			owner: account
		})
}

export default addDAO
