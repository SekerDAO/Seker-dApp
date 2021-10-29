import MultiSend from "../../abis/MultiSend.json"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import {
	buildMultiSendSafeTx,
	executeTx,
	safeApproveHash,
	SafeTransaction
} from "../gnosisSafe/safeUtils"
const {REACT_APP_MULTI_SEND_ADDRESS} = process.env

const multiSend = async (
	multiSendTxs: SafeTransaction[], // deployStrat1, deployStrat2... deploySeele, setSeeleStrat1, setSeeleStrat2...
	safeAddress: string,
	signer: JsonRpcSigner
): Promise<void> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nonce = await safeContract.nonce()
	const multiSendContract = new Contract(REACT_APP_MULTI_SEND_ADDRESS!, MultiSend.abi, signer)
	const multiTx = buildMultiSendSafeTx(multiSendContract, multiSendTxs, nonce)
	const hash = await safeApproveHash(signer, safeContract, multiTx, true)
	const tx = await executeTx(safeContract, multiTx, [hash])
	await tx.wait()
}

export default multiSend
