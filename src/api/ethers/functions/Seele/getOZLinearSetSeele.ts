import {JsonRpcSigner} from "@ethersproject/providers"
import OZLinearVoting from "../../abis/OZLinearVoting.json"
import {Contract} from "@ethersproject/contracts"
import {buildContractCallVariable, SafeTransaction} from "../gnosisSafe/safeUtils"
const {REACT_APP_MODULE_FACTORY_ADDRESS} = process.env

const OZ_LINEAR_MASTER = "0xA1D0AAFd677676F7eDfFdc48EF21b6fE7e8e05Cf"

const getOZLinearDeploy = async (
	OZLinearAddress: string,
	expectedSeeleAddress: string,
	signer: JsonRpcSigner
): Promise<SafeTransaction> => {
	const linearVotingMaster = new Contract(OZ_LINEAR_MASTER, OZLinearVoting.bytecode, signer)
	const setSeeleTx = buildContractCallVariable(
		linearVotingMaster,
		expectedSeeleAddress,
		"setSeele",
		[],
		0
	)
	return setSeeleTx
}

export default getOZLinearDeploy
