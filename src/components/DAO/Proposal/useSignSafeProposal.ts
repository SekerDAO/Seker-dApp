import {useState, useContext} from "react"
import {
	executeMultiSend,
	getMultiSendTxBuild,
	signMultiSend
} from "../../../api/ethers/functions/Usul/multiSend"
import {
	executeApproveNFTForAuction,
	signApproveNFTForAuction
} from "../../../api/ethers/functions/auction/approveNFTForAuction"
import {
	executeCancelAuction,
	signCancelAuction
} from "../../../api/ethers/functions/auction/cancelAuction"
import {
	executeCreateAuction,
	signCreateAuction
} from "../../../api/ethers/functions/auction/createAuction"
import {
	executeAddOwner,
	executeRemoveOwner,
	signAddOwner,
	signRemoveOwner
} from "../../../api/ethers/functions/gnosisSafe/addRemoveOwner"
import {SafeSignature} from "../../../api/ethers/functions/gnosisSafe/safeUtils"
import editDAO from "../../../api/firebase/DAO/editDAO"
import addSafeProposalSignature from "../../../api/firebase/safeProposal/addSafeProposalSignatures"
import {AuthContext} from "../../../context/AuthContext"
import {SafeProposal} from "../../../types/safeProposal"
import {toastError, toastSuccess} from "../../UI/Toast"

const useSignSafeProposal = ({
	proposal,
	canSign,
	id
}: {
	proposal: (SafeProposal & {gnosisVotingThreshold: number}) | null
	canSign: boolean
	id: string
}): {processing: boolean; sign: () => Promise<void>} => {
	const [processing, setProcessing] = useState(false)
	const {signer} = useContext(AuthContext)
	const sign = async () => {
		if (!(signer && proposal && canSign)) return
		setProcessing(true)
		try {
			let signature: SafeSignature | undefined = undefined
			let signatureStep2: SafeSignature | undefined = undefined
			let executed = false
			// Dirty way to handle the case when someone kicking himself.
			// In this case user will not be able to add signature bc of access rights
			// So we should add signature before we update the user, and avoid adding it twice
			let signatureAdded = false
			switch (proposal.type) {
				case "createAuction":
					;[signature] = await signApproveNFTForAuction(
						proposal.gnosisAddress,
						Number(proposal.nftId),
						proposal.nftAddress!,
						signer
					)
					;[signatureStep2] = await signCreateAuction(
						proposal.gnosisAddress,
						Number(proposal.nftId),
						proposal.nftAddress!,
						proposal.duration!,
						proposal.reservePrice!,
						proposal.auctionCurrencyAddress!,
						signer
					)
					if (proposal.signatures?.length === proposal.gnosisVotingThreshold - 1) {
						await executeApproveNFTForAuction(
							proposal.gnosisAddress,
							proposal.nftId!,
							proposal.nftAddress!,
							[...proposal.signatures, signature],
							signer
						)
						await executeCreateAuction(
							proposal.gnosisAddress,
							Number(proposal.nftId),
							proposal.nftAddress!,
							proposal.duration!,
							proposal.reservePrice!,
							proposal.auctionCurrencyAddress!,
							[...proposal.signaturesStep2!, signatureStep2],
							signer
						)
						executed = true
					}
					break
				case "cancelAuction":
					;[signature] = await signCancelAuction(
						proposal.gnosisAddress,
						proposal.auctionId!,
						signer
					)
					if (proposal.signatures?.length === proposal.gnosisVotingThreshold - 1) {
						await executeCancelAuction(
							proposal.gnosisAddress,
							proposal.auctionId!,
							[...proposal.signatures, signature],
							signer
						)
						executed = true
					}
					break
				case "changeRole":
					if (["head", "admin"].includes(proposal.newRole!)) {
						;[signature] = await signAddOwner(
							proposal.gnosisAddress,
							proposal.recipientAddress!,
							proposal.newThreshold!,
							signer
						)
						if (proposal.signatures?.length === proposal.gnosisVotingThreshold - 1) {
							await executeAddOwner(
								proposal.gnosisAddress,
								proposal.recipientAddress!,
								proposal.newThreshold!,
								[...proposal.signatures, signature],
								signer
							)
							executed = true
						}
					} else {
						;[signature] = await signRemoveOwner(
							proposal.gnosisAddress,
							proposal.recipientAddress!,
							proposal.newThreshold!,
							signer
						)
						if (proposal.signatures?.length === proposal.gnosisVotingThreshold - 1) {
							await addSafeProposalSignature({
								proposalId: id,
								signature: signature!,
								signatureStep2,
								...(executed ? {newState: "executed"} : {})
							})
							signatureAdded = true
							await executeRemoveOwner(
								proposal.gnosisAddress,
								proposal.recipientAddress!,
								proposal.newThreshold!,
								[...proposal.signatures, signature],
								signer
							)
							executed = true
						}
					}
					break
				case "decentralizeDAO":
					if (!proposal.multiTx) {
						throw new Error("Unexpected empty mulitTx in proposal")
					}
					if (!proposal.usulAddress) {
						throw new Error("Unexpected empty usulAddress in proposal")
					}
					;[signature] = await signMultiSend(proposal.multiTx, proposal.gnosisAddress, signer)
					if (proposal.signatures?.length === proposal.gnosisVotingThreshold - 1) {
						await executeMultiSend(
							proposal.multiTx,
							proposal.gnosisAddress,
							[signature, ...proposal.signatures],
							signer
						)
						await editDAO({
							gnosisAddress: proposal.gnosisAddress,
							usulAddress: proposal.usulAddress
						})
						executed = true
					}
					break
				case "generalEVM":
					if (!proposal.transactions) {
						throw new Error("Unexpected empty transactions for general EVM proposal")
					}
					const multiTx = await getMultiSendTxBuild(
						proposal.gnosisAddress,
						proposal.transactions,
						signer
					)
					;[signature] = await signMultiSend(multiTx, proposal.gnosisAddress, signer)
					if (proposal.signatures?.length === proposal.gnosisVotingThreshold - 1) {
						await executeMultiSend(
							multiTx,
							proposal.gnosisAddress,
							[signature, ...proposal.signatures],
							signer
						)
						executed = true
					}
					break
				default:
					throw new Error("Unexpected proposal type to sign")
			}
			if (!signatureAdded) {
				await addSafeProposalSignature({
					proposalId: id,
					signature: signature!,
					signatureStep2,
					...(executed ? {newState: "executed"} : {})
				})
			}
			toastSuccess("Successfully signed!")
		} catch (e) {
			console.error(e)
			toastError("Failed to sign proposal")
		}
		setProcessing(false)
	}
	return {sign, processing}
}

export default useSignSafeProposal
