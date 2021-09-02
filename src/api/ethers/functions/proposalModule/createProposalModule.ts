import ProposalModule from "../../abis/ProposalModule.json"
import {ContractFactory} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import {parseEther} from "@ethersproject/units"

const createProposalModule = async (
	safeAddress: string,
	proposalTime: number, // set to minutes for testing, days in production
	votingThreshold: number,
	signer: JsonRpcSigner
): Promise<string> => {
	const proposalModule = new ContractFactory(ProposalModule.abi, ProposalModule.bytecode, signer)
	const proposalDeploy = await proposalModule.deploy(
		proposalTime,
		parseEther(String(votingThreshold))
	)
	await proposalDeploy.deployed()
	// TODO: maybe these transaction should be split out for better broadcasting to the user what is happening
	const tx1 = await proposalDeploy.setAvatar(safeAddress)
	const tx2 = await proposalDeploy.transferOwnership(safeAddress)
	await Promise.all([tx1.wait(), tx2.wait()])
	return proposalDeploy.address
}

export default createProposalModule
