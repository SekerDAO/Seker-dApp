import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import {parseEther} from "@ethersproject/units"
import config from "../../../../config"
import Auction from "../../abis/Auction.json"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import {buildContractCall, executeTx, SafeSignature, safeSignMessage} from "../gnosisSafe/safeUtils"

export const signCreateAuction = async (
	safeAddress: string,
	nftID: number,
	nftAddress: string,
	duration: number,
	reservePrice: number,
	auctionCurrency: string,
	signer: JsonRpcSigner
): Promise<[SafeSignature, number]> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const auction = new Contract(config.AUCTION_ADDRESS, Auction.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(
		auction,
		"createAuction",
		[nftID, nftAddress, duration * 3600, parseEther(String(reservePrice)), auctionCurrency],
		nonce.add(1)
	)
	return [await safeSignMessage(signer, safeContract, call), nonce.toNumber()]
}

export const executeCreateAuction = async (
	safeAddress: string,
	nftID: number,
	nftAddress: string,
	duration: number,
	reservePrice: number,
	auctionCurrency: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<number> =>
	new Promise(async (resolve, reject) => {
		try {
			const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
			const auction = new Contract(config.AUCTION_ADDRESS, Auction.abi, signer)
			const nonce = await safeContract.nonce()
			const call = buildContractCall(
				auction,
				"createAuction",
				[nftID, nftAddress, duration * 3600, parseEther(String(reservePrice)), auctionCurrency],
				nonce
			)

			auction.on("AuctionCreated", id => {
				resolve(id.toString())
			})

			await executeTx(safeContract, call, signatures)
		} catch (e) {
			reject(e)
		}
	})
