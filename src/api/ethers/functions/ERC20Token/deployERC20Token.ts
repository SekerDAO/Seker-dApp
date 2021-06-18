import GovToken from "../../abis/GovToken.json"
import {JsonRpcSigner} from "@ethersproject/providers"
import {ContractFactory} from "@ethersproject/contracts"
import {parseEther} from "@ethersproject/units"

const deployERC20Token = async (
	name: string,
	symbol: string,
	totalSupply: number,
	signer: JsonRpcSigner
): Promise<string> => {
	const token = new ContractFactory(GovToken.abi, GovToken.bytecode, signer)
	const contract = await token.deploy(name, symbol, parseEther(String(totalSupply)))
	await contract.deployed()
	return contract.address
}

export default deployERC20Token
