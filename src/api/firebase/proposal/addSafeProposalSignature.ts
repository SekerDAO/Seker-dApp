import {SafeSignature} from "../../ethers/functions/gnosisSafe/safeUtils"
import {ProposalState} from "../../../types/proposal"
import firebase from "firebase"
const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

const addProposalSignatures = async ({
	proposalId,
	signature,
	signatureStep2,
	newState
}: {
	proposalId: string
	signature: SafeSignature
	signatureStep2?: SafeSignature
	newState?: ProposalState
}): Promise<void> => {
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firebase")
	}
	const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/addSafeProposalSignatures`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			proposalId,
			signature,
			...(signatureStep2 ? {signatureStep2} : {}),
			...(newState ? {newState} : {})
		})
	})
	if (res.status !== 200) {
		throw new Error("Failed to add NFT")
	}
}

export default addProposalSignatures
