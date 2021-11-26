import {ContractFactory} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import {parseEther} from "@ethersproject/units"
import GovToken from "../../abis/GovToken.json"

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
