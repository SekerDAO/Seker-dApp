import {Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GovToken from "../abis/GovToken.json"

const checkNFTOwner = async (
	account: string, // account of the token owner
	address: string, // gov token address
	to: string, // the address of the dao contract
	amount: number, // percentage of total supply given to dao
	provider: Web3Provider
): Promise<boolean> => {
	const ERC20Contract = new Contract(address, GovToken.abi, provider)
	let _tx = await ERC20Contract.approve(to, amount)

    provider.once(_tx.hash, (receipt) => {
        console.log('Transaction Minded: ' + receipt.transactionHash);
        console.log(receipt);
        return true
    })
    return false
}

export default checkNFTOwner
