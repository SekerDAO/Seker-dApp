import {Contract} from "@ethersproject/contracts"
import config from "../../../../config"
import AMBModule from "../../abis/AMBModule.json"
import {buildContractCall, SafeTransaction} from "../gnosisSafe/safeUtils"

const buildBridgeTx = async (
	tx: SafeTransaction,
	bridgeAddress: string
): Promise<SafeTransaction> => {
	const bridge = new Contract(bridgeAddress, AMBModule.abi)
	const amb = new Contract(config.AMB_ADDRESS, AMBModule.abi)

	const bridgeCall = buildContractCall(
		bridge,
		"executeTransaction",
		[tx.to, tx.value, tx.data, tx.operation],
		0
	)
	return buildContractCall(
		amb,
		"requireToPassMessage",
		[bridgeAddress, bridgeCall.data, 3000000],
		0
	)
}

export default buildBridgeTx
