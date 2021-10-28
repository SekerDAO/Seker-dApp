import {JsonRpcSigner} from "@ethersproject/providers"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import {Contract} from "@ethersproject/contracts"
import {buildContractCall, SafeTransaction} from "../gnosisSafe/safeUtils"
const {REACT_APP_MODULE_FACTORY_ADDRESS} = process.env

const OZ_LINEAR_MASTER = "0xA1D0AAFd677676F7eDfFdc48EF21b6fE7e8e05Cf"

const getRegisterSeeleTx = async (
	safeAddress: string,
	expectedSeeleAddress: string,
	signer: JsonRpcSigner
): Promise<SafeTransaction> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nonce = await safeContract.nonce()
	const setSeeleTx = buildContractCall(safeContract, "enableModule", [expectedSeeleAddress], nonce)
	return setSeeleTx
}

export default getRegisterSeeleTx
