import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
import TWDomainToken from "../abis/TWDomainToken.json"
import {Contract} from "@ethersproject/contracts"
import firebase from "firebase"

// prettier-ignore
const createNFT = async (account: string, hashes: string[], numberOfEditions: string, nftAddress: string, isCustomDomain: boolean, signer: JsonRpcSigner | null, provider: Web3Provider | null): Promise<void> => {
	// @ts-expect-error: Let's ignore a compile error like this unreachable code
	const nft = new Contract(nftAddress, TWDomainToken.abi, signer)
	const _tx = await nft.mintEdition(hashes, parseInt(numberOfEditions))
	// @ts-expect-error: Let's ignore a compile error like this unreachable code
    provider.once(_tx.hash, (receipt) => {
        console.log('Transaction Minded: ' + receipt.transactionHash);
        console.log(receipt);
    })
	// store the new nft ids in the database and autopopulate the profile, autp set to private
	const snapshot = await firebase.firestore().collection('users').doc(account).get();
}

export default createNFT
