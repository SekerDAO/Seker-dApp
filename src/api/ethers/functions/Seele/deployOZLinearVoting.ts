import {JsonRpcSigner} from "@ethersproject/providers"
import OZLinearVoting from "../../abis/OZLinearVoting.json"
import {ContractFactory} from "@ethersproject/contracts"

const deployOZLinearVoting = async (
	owner: string,
	governanceToken: string,
	seeleModule: string,
	quorumThreshold: number,
	delay: number,
	votingPeriod: number,
	name: string,
	signer: JsonRpcSigner
): Promise<string> => {
	const ozLinearVoting = new ContractFactory(OZLinearVoting.abi, OZLinearVoting.bytecode, signer)
	const contract = await ozLinearVoting.deploy(
		owner,
		governanceToken,
		seeleModule,
		quorumThreshold,
		delay,
		votingPeriod,
		name
	)
	await contract.deployed()
	return contract.address
}

export default deployOZLinearVoting
