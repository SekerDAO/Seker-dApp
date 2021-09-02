import LinearVotingModule from "../../abis/LinearVotingModule.json"
import GovToken from "../../abis/GovToken.json"
import {Contract, ContractFactory} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import {parseEther} from "@ethersproject/units"

const createLinearVoting = async (
	totalSupply: number, // total supply of governance token created in a previous step
	proposalModuleAddress: string, // the the proposal module address
	governanceTokenAddress: string, // address of the ERC20 gov token
	undelegateDelay: number, // this should be equal to the proposal time
	safeAddress: string, // address of the DAO
	signer: JsonRpcSigner
): Promise<string> => {
	const votingModule = new ContractFactory(
		LinearVotingModule.abi,
		LinearVotingModule.bytecode,
		signer
	)
	const votingDeploy = await votingModule.deploy(
		governanceTokenAddress,
		proposalModuleAddress,
		undelegateDelay,
		safeAddress
	)
	await votingDeploy.deployed()
	const govenanceToken = new Contract(governanceTokenAddress, GovToken.abi, signer)
	// TODO: maybe these transaction should be split out for better broadcasting to the user what is happening
	const tx = await govenanceToken.transfer(safeAddress, parseEther(String(totalSupply)))
	await tx.wait()
	return votingDeploy.address
}

export default createLinearVoting
