import {JsonRpcSigner} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import Auction from "../../abis/ZoraAuction.json"
import {buildContractCall, executeTx, SafeSignature, safeSignMessage} from "../gnosisSafe/safeUtils"
import {parseEther} from "@ethersproject/units"
const {REACT_APP_ZORA_ADDRESS} = process.env

export const signCreateZoraAuction = async (
	safeAddress: string,
	nftID: number,
	nftAddress: string,
	duration: number,
	reservePrice: number,
	curator: string,
	curatorFeePercentage: number,
	auctionCurrency: string,
	signer: JsonRpcSigner
): Promise<SafeSignature> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const auction = new Contract(REACT_APP_ZORA_ADDRESS!, Auction.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(
		auction,
		"createAuction",
		[
			nftID,
			nftAddress,
			duration,
			parseEther(String(reservePrice)),
			curator,
			curatorFeePercentage,
			auctionCurrency
		],
		nonce + 1
	)
	return safeSignMessage(signer, safeContract, call)
}

export const executeCreateZoraAuction = async (
	safeAddress: string,
	nftID: number,
	nftAddress: string,
	duration: number,
	reservePrice: number,
	curator: string,
	curatorFeePercentage: number,
	auctionCurrency: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<number> =>
	new Promise(async (resolve, reject) => {
		try {
			const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
			const auction = new Contract(REACT_APP_ZORA_ADDRESS!, Auction.abi, signer)
			const nonce = await safeContract.nonce()
			const call = buildContractCall(
				auction,
				"createAuction",
				[
					nftID,
					nftAddress,
					duration,
					parseEther(String(reservePrice)),
					curator,
					curatorFeePercentage,
					auctionCurrency
				],
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
