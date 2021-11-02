import {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import EthersContext from "../../../context/EthersContext"
import {toastError, toastSuccess} from "../../UI/Toast"
import bidAuction from "../../../api/ethers/functions/auction/bidAuction"
import Button from "../../Controls/Button"
import Modal from "../Modal"
import Input from "../../Controls/Input"
import "./styles.scss"
import approveERC20 from "../../../api/ethers/functions/ERC20Token/approveERC20"
const {REACT_APP_ZORA_ADDRESS} = process.env

const BidAuctionModal: FunctionComponent<{
	disabled: boolean
	auctionId: number
	minBid: number
	auctionTokenAddress?: string
}> = ({disabled, auctionId, minBid, auctionTokenAddress}) => {
	const [isOpened, setIsOpened] = useState(false)
	const [processing, setProcessing] = useState(false)
	const {provider, signer} = useContext(EthersContext)
	const [bid, setBid] = useState("")

	const handleSubmit = async () => {
		if (!(provider && signer && bid && !isNaN(Number(bid)) && Number(bid) > minBid)) return
		setProcessing(true)
		try {
			if (auctionTokenAddress) {
				await approveERC20(
					auctionTokenAddress,
					REACT_APP_ZORA_ADDRESS!,
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
					<Input
						number
						borders="all"
						id="create-bid-amount"
						value={bid}
						onChange={handleBidChange}
					/>
					<Button onClick={handleSubmit} disabled={submitButtonDisabled || processing}>
						{processing ? "Processing..." : "Place Bid"}
					</Button>
				</div>
			</Modal>
		</>
	)
}

export default BidAuctionModal
