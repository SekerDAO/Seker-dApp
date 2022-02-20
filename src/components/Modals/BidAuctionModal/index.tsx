import {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import approveERC20 from "../../../api/ethers/functions/ERC20Token/approveERC20"
import bidAuction from "../../../api/ethers/functions/auction/bidAuction"
import config from "../../../config"
import {AuthContext} from "../../../context/AuthContext"
import {ProviderContext} from "../../../context/ProviderContext"
import Button from "../../Controls/Button"
import Input from "../../Controls/Input"
import {toastError, toastSuccess} from "../../UI/Toast"
import Modal from "../Modal"
import "./styles.scss"

const BidAuctionModal: FunctionComponent<{
	disabled: boolean
	auctionId: number
	minBid: number
	auctionTokenAddress?: string
}> = ({disabled, auctionId, minBid, auctionTokenAddress}) => {
	const [isOpened, setIsOpened] = useState(false)
	const [processing, setProcessing] = useState(false)
	const {provider} = useContext(ProviderContext)
	const {signer} = useContext(AuthContext)
	const [bid, setBid] = useState("")

	const handleSubmit = async () => {
		if (!(provider && signer && bid && !isNaN(Number(bid)) && Number(bid) > minBid)) return
		setProcessing(true)
		try {
			if (auctionTokenAddress) {
				await approveERC20(
					auctionTokenAddress,
					config.AUCTION_ADDRESS,
					Number(bid),
					provider,
					signer
				)
			}
			await bidAuction(auctionId, Number(bid), !!auctionTokenAddress, signer)
			toastSuccess("Bid successfully placed!")
			setIsOpened(false)
		} catch (e) {
			console.error(e)
			toastError("Failed to place bid")
		}
		setProcessing(false)
	}

	const handleBidChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setBid("0")
		} else {
			setBid(e.target.value)
		}
	}

	const submitButtonDisabled = !bid || isNaN(Number(bid)) || Number(bid) <= minBid

	return (
		<>
			<Button
				disabled={disabled}
				onClick={() => {
					setIsOpened(true)
				}}
			>
				Place Bid
			</Button>
			<Modal
				show={isOpened}
				onClose={() => {
					setIsOpened(false)
				}}
			>
				<div className="create-bid">
					<label htmlFor="create-bid-amount">Amount</label>
					<Input number id="create-bid-amount" value={bid} onChange={handleBidChange} />
					<Button onClick={handleSubmit} disabled={submitButtonDisabled || processing}>
						{processing ? "Processing..." : "Place Bid"}
					</Button>
				</div>
			</Modal>
		</>
	)
}

export default BidAuctionModal
