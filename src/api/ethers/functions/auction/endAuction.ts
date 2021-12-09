import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import config from "../../../../config"
import Auction from "../../abis/Auction.json"

const endAuction = async (auctionId: number, signer: JsonRpcSigner): Promise<void> => {
	const auction = new Contract(config.AUCTION_ADDRESS, Auction.abi, signer)
	const tx = await auction.endAuction(auctionId)
	await tx.wait()
}

export default endAuction
