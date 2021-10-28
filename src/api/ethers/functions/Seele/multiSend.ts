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
const MultiSendAddress = "0x2890dd2Cf1E4881b630bd680E50439b9DE00AC02"

const multiSend = async (
	multiSendTxs: SafeTransaction[], // deployStrat1, deployStrat2... deploySeele, setSeeleStrat1, setSeeleStrat2...
	safeAddress: string,
	signer: JsonRpcSigner
): Promise<string> =>
	new Promise(async (resolve, reject) => {
		try {
			const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
			const nonce = await safeContract.nonce()
			const multiSendContract = new Contract(MultiSendAddress, MultiSend.abi, signer)
			const multiTx = buildMultiSendSafeTx(multiSendContract, multiSendTxs, nonce)
			executeTx(safeContract, multiTx, [await safeApproveHash(signer, safeContract, multiTx, true)])
		} catch (e) {
			reject(e)
		}
	})

export default multiSend
