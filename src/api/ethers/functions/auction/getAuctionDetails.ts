import {AddressZero} from "@ethersproject/constants"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcProvider} from "@ethersproject/providers"
import {formatEther} from "@ethersproject/units"
import config from "../../../../config"
import {AuctionEthersData} from "../../../../types/auction"
import Auction from "../../abis/Auction.json"

const getAuctionDetails = async (
	auctionId: number,
	provider: JsonRpcProvider
): Promise<AuctionEthersData> => {
	const auction = new Contract(config.AUCTION_ADDRESS, Auction.abi, provider)
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
