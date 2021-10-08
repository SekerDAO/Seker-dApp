import React, {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import useDAOAuctions from "../../../customHooks/getters/useDAOAuctions"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import Loader from "../../Loader"
import {Auction} from "../../../types/auction"
import Select from "../../Controls/Select"
import Button from "../../Controls/Button"
import {toastError, toastSuccess} from "../../Toast"
import {SafeSignature} from "../../../api/ethers/functions/gnosisSafe/safeUtils"
import {
	executeApproveAuction,
	signApproveAuction
} from "../../../api/ethers/functions/auction/approveAuction"
import EthersContext from "../../../context/EthersContext"
import addProposal from "../../../api/firebase/proposal/addProposal"
import {AuthContext} from "../../../context/AuthContext"
import {ProposalState} from "../../../types/proposal"

const ApproveAuction: FunctionComponent<{
	gnosisAddress: string
	isAdmin: boolean
	gnosisVotingThreshold: number
}> = ({gnosisAddress, isAdmin, gnosisVotingThreshold}) => {
	const {signer} = useContext(EthersContext)
	const {account} = useContext(AuthContext)
	const {auctions, loading, error} = useDAOAuctions(gnosisAddress)
	const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null)
	const [processing, setProcessing] = useState(false)

	if (error) return <ErrorPlaceholder />
	if (loading) return <Loader />

	const handleAuctionChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSelectedAuction(auctions.find(a => String(a.id) === e.target.value) ?? null)
	}

	const handleSubmit = async () => {
		if (!(account && signer && selectedAuction)) return
		setProcessing(true)
		try {
			const signatures: SafeSignature[] = []
			let state: ProposalState = "active"
			if (isAdmin) {
				const signature = await signApproveAuction(gnosisAddress, selectedAuction.id, signer)
				signatures.push(signature)
				if (gnosisVotingThreshold === 1) {
					await executeApproveAuction(gnosisAddress, selectedAuction.id, signatures, signer)
					state = "executed"
				}
			}
			await addProposal({
				type: "approveAuction",
				module: "gnosis",
				userAddress: account.toLowerCase(),
				title: `Approve Auction for ${selectedAuction.nftName}`,
				auctionId: selectedAuction.id,
				gnosisAddress: gnosisAddress.toLowerCase(),
				signatures,
				state
			})
			toastSuccess("Proposal successfully created")
		} catch (e) {
			console.error(e)
			toastError("Failed to create proposal")
		}
		setProcessing(false)
	}

	return (
		<>
			<label htmlFor="approve-auction-id">Auction ID</label>
			<Select
				options={[{name: "Choose One", value: ""}].concat(
					auctions
						.filter(a => a.state === "waitingApproval")
						.map(a => ({name: String(a.nftName), value: String(a.id)}))
				)}
				onChange={handleAuctionChange}
				id="approve-auction-id"
				fullWidth
			/>
			<Button disabled={processing || !selectedAuction} onClick={handleSubmit}>
				{processing ? "Processing..." : "Create Proposal"}
			</Button>
		</>
	)
}

export default ApproveAuction
