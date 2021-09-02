import ProposalModule from "../../abis/ProposalModule.json"
import {ContractFactory} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"

const createProposalModule = async (
	safeAddress: string,
	gracePeriodTime: number, // set to minutes for testing, days in production
	votingThreshold: number,
	signer: JsonRpcSigner
): Promise<string> => {
	const proposalModule = new ContractFactory(ProposalModule.abi, ProposalModule.bytecode, signer)
	const proposalDeploy = await proposalModule.deploy(gracePeriodTime, votingThreshold)
	await proposalDeploy.deployed()
	// maybe these transaction should be split out for better broadcasting to the user what is happening
	await proposalDeploy.setAvatar(safeAddress)
	await proposalDeploy.transferOwnership(safeAddress)
	return proposalDeploy.address
}

export default createProposalModule
