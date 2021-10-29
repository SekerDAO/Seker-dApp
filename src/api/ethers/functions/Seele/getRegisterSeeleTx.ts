import {JsonRpcSigner} from "@ethersproject/providers"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import {Contract} from "@ethersproject/contracts"
import {buildContractCall, SafeTransaction} from "../gnosisSafe/safeUtils"

const getRegisterSeeleTx = async (
	safeAddress: string,
	expectedSeeleAddress: string,
	signer: JsonRpcSigner
): Promise<SafeTransaction> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nonce = await safeContract.nonce()
	return buildContractCall(safeContract, "enableModule", [expectedSeeleAddress], nonce)
}

export default getRegisterSeeleTx
