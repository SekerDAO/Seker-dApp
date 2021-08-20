import {JsonRpcProvider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import Auction from "../../abis/ZoraAuction.json"
import {ZoraAuctionEthersData} from "../../../../types/zoraAuction"
import {formatEther} from "@ethersproject/units"
import {AddressZero} from "@ethersproject/constants"
const {REACT_APP_ZORA_ADDRESS} = process.env

const getAuctionDetails = async (
	auctionId: number,
	provider: JsonRpcProvider
): Promise<ZoraAuctionEthersData> => {
	const auction = new Contract(REACT_APP_ZORA_ADDRESS!, Auction.abi, provider)
	const {amount, approved, firstBidTime, duration, reservePrice, tokenOwner} =
		await auction.auctions(auctionId)
	const endTime = (Number(firstBidTime.toString()) + Number(duration.toString())) * 1000
	const state =
		tokenOwner === AddressZero
			? "finalized"
			: approved
			? Number(firstBidTime.toString()) > 0
				? endTime < new Date().getTime()
					? "ended"
					: "live"
				: "approved"
			: "waitingApproval"

	return {
		price: Math.max(
			Number(formatEther(amount.toString())),
			Number(formatEther(reservePrice.toString()))
		),
		state,
		...(state === "live" ? {endTime} : {})
	}
}

export default getAuctionDetails
