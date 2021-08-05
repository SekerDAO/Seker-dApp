import {JsonRpcSigner} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import Auction from "../../abis/ZoraAuction.json"
const {REACT_APP_ZORA_ADDRESS} = process.env

const endZoraAuction = async (auctionId: number, signer: JsonRpcSigner): Promise<void> => {
	const auction = new Contract(REACT_APP_ZORA_ADDRESS!, Auction.abi, signer)
	const tx = await auction.endAuction(auctionId)
	await tx.wait()
}

export default endZoraAuction
