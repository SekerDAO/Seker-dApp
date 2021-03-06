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
import {
	executeRegisterModuleTx,
	signRegisterModuleTx
} from "../../../api/ethers/functions/gnosisSafe/registerModule"
import {SafeSignature} from "../../../api/ethers/functions/gnosisSafe/safeUtils"
import addUsul from "../../../api/firebase/DAO/addUsul"
import addSafeProposalSignature from "../../../api/firebase/safeProposal/addSafeProposalSignatures"
import {AuthContext} from "../../../context/AuthContext"
import useCheckNetwork from "../../../hooks/useCheckNetwork"
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

	const checkedSignMultiSend = useCheckNetwork(signMultiSend)
	const checkedGetMultiSendTxBuild = useCheckNetwork(getMultiSendTxBuild)
	const checkedExecuteMultiSend = useCheckNetwork(executeMultiSend)
	const checkedSignRegisterModule = useCheckNetwork(signRegisterModuleTx)
	const checkedExecuteRegisterModule = useCheckNetwork(executeRegisterModuleTx)
	const checkedSignAddOwner = useCheckNetwork(signAddOwner)
	const checkedSignRemoveOwner = useCheckNetwork(signRemoveOwner)
	const checkedExecuteAddOwner = useCheckNetwork(executeAddOwner)
	const checkedExecuteRemoveOwner = useCheckNetwork(executeRemoveOwner)

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
						;[signature] = await checkedSignAddOwner(
							proposal.gnosisAddress,
							proposal.recipientAddress!,
							proposal.newThreshold!,
							signer
						)
						if (proposal.signatures?.length === proposal.gnosisVotingThreshold - 1) {
							await checkedExecuteAddOwner(
								proposal.gnosisAddress,
								proposal.recipientAddress!,
								proposal.newThreshold!,
								[...proposal.signatures, signature],
								signer
							)
							executed = true
						}
					} else {
						;[signature] = await checkedSignRemoveOwner(
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
							await checkedExecuteRemoveOwner(
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
					if (!proposal.usulAddress) {
						throw new Error("Unexpected empty usulAddress in proposal")
					}
					if (proposal.usulDeployType === "usulSingle") {
						if (!proposal.multiTx) {
							throw new Error("Unexpected empty mulitTx in proposal")
						}
						;[signature] = await checkedSignMultiSend(
							proposal.multiTx,
							proposal.gnosisAddress,
							signer
						)
						if (proposal.signatures?.length === proposal.gnosisVotingThreshold - 1) {
							await checkedExecuteMultiSend(
								proposal.multiTx,
								proposal.gnosisAddress,
								[signature, ...proposal.signatures],
								signer
							)
							await addUsul({
								gnosisAddress: proposal.gnosisAddress,
								usul: {
									usulAddress: proposal.usulAddress,
									deployType: "usulSingle"
								}
							})
							executed = true
						}
					} else {
						if (!proposal.bridgeAddress) {
							throw new Error("Unexpected empty bridge address in proposal")
						}
						if (!proposal.sideNetSafeAddress) {
							throw new Error("Unexpected empty side net safe address in proposal")
						}
						;[signature] = await checkedSignRegisterModule(
							proposal.gnosisAddress,
							proposal.bridgeAddress,
							signer
						)
						if (proposal.signatures?.length === proposal.gnosisVotingThreshold - 1) {
							await checkedExecuteRegisterModule(
								proposal.gnosisAddress,
								proposal.bridgeAddress,
								[signature, ...proposal.signatures],
								signer
							)
							await addUsul({
								gnosisAddress: proposal.gnosisAddress,
								usul: {
									usulAddress: proposal.usulAddress,
									deployType: "usulMulti",
									bridgeAddress: proposal.bridgeAddress,
									sideNetSafeAddress: proposal.sideNetSafeAddress
								}
							})
						}
					}
					break
				case "generalEVM":
					if (!proposal.transactions) {
						throw new Error("Unexpected empty transactions for general EVM proposal")
					}
					const multiTx = await checkedGetMultiSendTxBuild(
						proposal.gnosisAddress,
						proposal.transactions,
						signer
					)
					;[signature] = await checkedSignMultiSend(multiTx, proposal.gnosisAddress, signer)
					if (proposal.signatures?.length === proposal.gnosisVotingThreshold - 1) {
						await checkedExecuteMultiSend(
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
