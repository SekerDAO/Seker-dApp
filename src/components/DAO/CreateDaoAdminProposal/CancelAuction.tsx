import {FunctionComponent, useContext, useState} from "react"
import {Auction} from "../../../types/auction"
import Select from "../../Controls/Select"
import Button from "../../Controls/Button"
import {toastError, toastSuccess} from "../../Toast"
import EthersContext from "../../../context/EthersContext"
import {AuthContext} from "../../../context/AuthContext"

const CancelAuction: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	title: string
	description: string
	afterSubmit: () => void
}> = ({gnosisAddress, gnosisVotingThreshold, title, description, afterSubmit}) => {
	const {signer} = useContext(EthersContext)
	const {account} = useContext(AuthContext)
	// TODO
	const auctions: Auction[] = []
	const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null)
	const [processing, setProcessing] = useState(false)

	const handleAuctionChange = (auctionId: string | number) => {
		setSelectedAuction(auctions.find(a => String(a.id) === auctionId) ?? null)
	}

	const handleSubmit = async () => {
		if (!(account && signer && selectedAuction)) return
		setProcessing(true)
		try {
			console.log("TODO")
			setSelectedAuction(null)
			afterSubmit()
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
				placeholder="Choose one"
				value={selectedAuction?.id}
				options={auctions
					.filter(a => a.state === "approved")
					.map(a => ({name: String(a.nftName), value: String(a.id)}))}
				onChange={handleAuctionChange}
				id="cancel-auction-id"
				fullWidth
			/>
			<Button
				disabled={processing || !selectedAuction}
				onClick={handleSubmit}
				extraClassName="create-dao-proposal__submit-button"
			>
				{processing ? "Processing..." : "Create Proposal"}
			</Button>
		</>
	)
}

export default CancelAuction
