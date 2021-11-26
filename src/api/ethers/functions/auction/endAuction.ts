import Auction from "../../abis/Auction.json"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"

const {REACT_APP_ZORA_ADDRESS} = process.env

const endAuction = async (auctionId: number, signer: JsonRpcSigner): Promise<void> => {
	const auction = new Contract(REACT_APP_ZORA_ADDRESS!, Auction.abi, signer)
	const tx = await auction.endAuction(auctionId)
	await tx.wait()
}

export default endAuction
