import MultiArtToken from "../../abis/MultiArtToken.json"
import TWDomainToken from "../../abis/TWDomainToken.json"
import {BigNumber} from "@ethersproject/bignumber"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner, JsonRpcProvider} from "@ethersproject/providers"

const {REACT_APP_DOMAIN_ADDRESS} = process.env

const createNFT = async (
	hashes: string[],
	numberOfEditions: number,
	signer: JsonRpcSigner,
	provider: JsonRpcProvider,
	customDomain?: string
): Promise<number[]> =>
	new Promise<number[]>(async resolve => {
		let isMined = false
		const ids: number[] = []
		const nft = new Contract(
			customDomain ?? REACT_APP_DOMAIN_ADDRESS!,
			customDomain ? MultiArtToken.abi : TWDomainToken.abi,
			signer
		)
		const address = await signer.getAddress()

		const eventListener = (_: unknown, _address: string, id: BigNumber) => {
			if (_address.toLowerCase() !== address.toLowerCase()) return
			ids.push(Number(id.toString()))
			if (isMined && ids.length === numberOfEditions) {
				nft.off("Transfer", eventListener)
				resolve(ids)
			}
		}

		nft.on("Transfer", eventListener)

		const tx = await nft.mintEdition(hashes, numberOfEditions)
		provider.once(tx.hash, () => {
			if (ids.length === numberOfEditions) {
				resolve(ids)
			} else {
				isMined = true
			}
		})
	})

export default createNFT
