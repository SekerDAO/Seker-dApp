import {FunctionComponent, useContext, useState} from "react"
import {useParams} from "react-router-dom"
import EthersContext from "../../context/EthersContext"
import {SafeSignature} from "../../api/ethers/functions/gnosisSafe/safeUtils"
import {
	executeApproveNFTForAuction,
	signApproveNFTForAuction
} from "../../api/ethers/functions/auction/approveNFTForAuction"
import {
	executeCreateAuction,
	signCreateAuction
} from "../../api/ethers/functions/auction/createAuction"
import {
	executeCancelAuction,
	signCancelAuction
} from "../../api/ethers/functions/auction/cancelAuction"
import {
	executeAddOwner,
	executeRemoveOwner,
	signAddOwner,
	signRemoveOwner
} from "../../api/ethers/functions/gnosisSafe/addRemoveOwner"
import addSafeProposalSignature from "../../api/firebase/safeProposal/addSafeProposalSignatures"
import {toastError, toastSuccess} from "../../components/UI/Toast"
import "./styles.scss"
import useProposal from "../../hooks/getters/useProposal"
import Loader from "../../components/UI/Loader"
import ErrorPlaceholder from "../../components/UI/ErrorPlaceholder"
import {executeMultiSend, signMultiSend} from "../../api/ethers/functions/Usul/multiSend"
import editDAO from "../../api/firebase/DAO/editDAO"

const Proposal: FunctionComponent = () => {
	const {id} = useParams<{id: string}>()
	const {proposal, gnosisVotingThreshold, loading, error, canSign} = useProposal(id)
	const [processing, setProcessing] = useState(false)
	const {signer} = useContext(EthersContext)

	if (loading) return <Loader />
	if (error) return <ErrorPlaceholder />

	const sign = async () => {
		if (!(signer && proposal && gnosisVotingThreshold !== null && canSign)) return
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
					const signingArgs = [
						proposal.gnosisAddress,
						Number(proposal.nftId),
						proposal.nftAddress!,
						proposal.duration!,
						proposal.reservePrice!,
						proposal.curatorAddress!,
						proposal.curatorFeePercentage!,
						proposal.auctionCurrencyAddress!,
						signer
					] as const
					;[signature] = await signApproveNFTForAuction(...signingArgs)
					signatureStep2 = await signCreateAuction(...signingArgs)
					if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
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
							proposal.curatorAddress!,
							proposal.curatorFeePercentage!,
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
					if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
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
						if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
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
						if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
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
					if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
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

	return (
		<div className="proposal">
			<div>TODO: proposal page</div>
			{canSign && (
				<button className="btn" onClick={sign} disabled={processing}>
					{processing ? "Processing..." : "Sign"}
				</button>
			)}
		</div>
	)
}

export default Proposal
