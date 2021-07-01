import {JsonRpcSigner} from "@ethersproject/providers"
import MultiArtToken from "../../abis/MultiArtToken.json"
import {ContractFactory} from "@ethersproject/contracts"

const deployCustomDomain = async (
	name: string,
	symbol: string,
	signer: JsonRpcSigner
): Promise<string> => {
	const factory = new ContractFactory(MultiArtToken.abi, MultiArtToken.bytecode, signer)
	const contract = await factory.deploy(name, symbol)
	await contract.deployed()
	return contract.address
}

export default deployCustomDomain
