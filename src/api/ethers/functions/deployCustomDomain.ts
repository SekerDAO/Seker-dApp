import {JsonRpcSigner} from "@ethersproject/providers"
import artToken from "../abis/ArtToken.json"
import {ContractFactory} from "@ethersproject/contracts"

const deployCustomDomain = async (name: string, symbol: string, signer: JsonRpcSigner): Promise<void> => {
	const factory = new ContractFactory(artToken.abi, artToken.bytecode, signer)
	const contract = await factory.deploy(name, symbol)
	await contract.deployed()
}

export default deployCustomDomain
