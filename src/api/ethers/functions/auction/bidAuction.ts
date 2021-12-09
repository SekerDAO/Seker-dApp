import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import {parseEther} from "@ethersproject/units"
import config from "../../../../config"
import Auction from "../../abis/Auction.json"

const bidAuction = async (
	auctionId: number,
	amount: number,
	customCurrency: boolean,
	signer: JsonRpcSigner
): Promise<void> => {
	const auction = new Contract(config.AUCTION_ADDRESS!, Auction.abi, signer)
	const tx = await auction.createBid(
		auctionId,
		parseEther(String(amount)),
		...(customCurrency ? [{value: parseEther(String(amount))}] : [])
	)
	await tx.wait()
}

export default bidAuction
