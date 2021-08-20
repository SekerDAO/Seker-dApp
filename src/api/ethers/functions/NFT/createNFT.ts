import {JsonRpcSigner, JsonRpcProvider} from "@ethersproject/providers"
import TWDomainToken from "../../abis/TWDomainToken.json"
import MultiArtToken from "../../abis/MultiArtToken.json"
import {Contract} from "@ethersproject/contracts"
const {REACT_APP_DOMAIN_ADDRESS} = process.env

const createNFT = async (
	hashes: string[],
	numberOfEditions: number,
	signer: JsonRpcSigner,
	provider: JsonRpcProvider,
	customDomain?: string
): Promise<number> =>
	new Promise<number>(async resolve => {
		let isMined = false
		let nftId: number
		const nft = new Contract(
			customDomain ?? REACT_APP_DOMAIN_ADDRESS!,
			customDomain ? MultiArtToken.abi : TWDomainToken.abi,
			signer
		)
		nft.once("Transfer", (_, __, id) => {
			const _nftId = Number(id.toString())
			if (isMined) {
				resolve(_nftId)
			} else {
				nftId = _nftId
			}
		})

		const tx = await nft.mintEdition(hashes, numberOfEditions)
		provider.once(tx.hash, () => {
			if (nftId !== undefined) {
				resolve(nftId)
			} else {
				isMined = true
			}
		})
	})

export default createNFT
