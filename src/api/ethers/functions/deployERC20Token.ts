import GovToken from "../abis/GovToken.json"
import {BigNumber} from "@ethersproject/bignumber"
import {JsonRpcSigner} from "@ethersproject/providers"
import {ContractFactory} from "@ethersproject/contracts"

const deployERC20Token = async (
	name: string,
	symbol: string,
	totalSupply: number,
	signer: JsonRpcSigner
): Promise<string> => {
	const one = BigNumber.from("1000000000000000000")
	const totalSupplyBN = BigNumber.from(totalSupply)
	const totalSupply18Decimals = totalSupplyBN.mul(one)

	const token = new ContractFactory(GovToken.abi, GovToken.bytecode, signer)
	const contract = await token.deploy(name, symbol, totalSupply18Decimals)
	await contract.deployed()
	return contract.address
}

export default deployERC20Token
