import React, {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import useDAOZoraAuctions from "../../../customHooks/getters/useDAOZoraAuctions"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import Loader from "../../Loader"
import {ZoraAuction} from "../../../types/zoraAuction"
import Select from "../../Controls/Select"
import Button from "../../Controls/Button"
import {toastError, toastSuccess} from "../../Toast"
import {SafeSignature} from "../../../api/ethers/functions/gnosisSafe/safeUtils"
import EthersContext from "../../../context/EthersContext"
import addProposal from "../../../api/firebase/proposal/addProposal"
import {AuthContext} from "../../../context/AuthContext"
import {ProposalState} from "../../../types/proposal"
import {
	executeCancelZoraAuction,
	signCancelZoraAuction
} from "../../../api/ethers/functions/zoraAuction/cancelZoraAuction"

const CancelZoraAuction: FunctionComponent<{
	gnosisAddress: string
	isAdmin: boolean
	gnosisVotingThreshold: number
}> = ({gnosisAddress, isAdmin, gnosisVotingThreshold}) => {
	const {signer} = useContext(EthersContext)
	const {account} = useContext(AuthContext)
	const {auctions, loading, error} = useDAOZoraAuctions(gnosisAddress)
	const [selectedAuction, setSelectedAuction] = useState<ZoraAuction | null>(null)
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
				const signature = await signCancelZoraAuction(gnosisAddress, selectedAuction.id, signer)
				signatures.push(signature)
				if (gnosisVotingThreshold === 1) {
					await executeCancelZoraAuction(gnosisAddress, selectedAuction.id, signatures, signer)
					state = "executed"
				}
			}
			await addProposal({
				type: "cancelZoraAuction",
				module: "gnosis",
				userAddress: account,
				title: `Cancel Auction for ${selectedAuction.nftName}`,
				auctionId: selectedAuction.id,
				gnosisAddress,
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
			<label htmlFor="cancel-auction-id">Auction ID</label>
			<Select
				options={[{name: "Choose One", value: ""}].concat(
					auctions
						.filter(a => a.state === "approved")
						.map(a => ({name: String(a.nftName), value: String(a.id)}))
				)}
				onChange={handleAuctionChange}
				id="cancel-auction-id"
				fullWidth
			/>
			<Button disabled={processing || !selectedAuction} onClick={handleSubmit}>
				{processing ? "Processing..." : "Create Proposal"}
			</Button>
		</>
	)
}

export default CancelZoraAuction
