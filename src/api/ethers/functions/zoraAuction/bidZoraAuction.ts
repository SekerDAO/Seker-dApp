import {JsonRpcSigner} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import Auction from "../../abis/ZoraAuction.json"
import {parseEther} from "@ethersproject/units"
const {REACT_APP_ZORA_ADDRESS} = process.env

const bidZoraAuction = async (
	auctionId: number,
	amount: number,
	signer: JsonRpcSigner
): Promise<void> => {
	const auction = new Contract(REACT_APP_ZORA_ADDRESS!, Auction.abi, signer)
	const tx = await auction.createBid(auctionId, parseEther(String(amount)))
	await tx.wait()
}

export default bidZoraAuction
