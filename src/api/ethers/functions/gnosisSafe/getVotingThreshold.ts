import {Contract} from "@ethersproject/contracts"
import {JsonRpcProvider} from "@ethersproject/providers"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"

const getVotingThreshold = async (
	gnosisAddress: string,
	provider: JsonRpcProvider
): Promise<number> => {
	const safeContract = new Contract(gnosisAddress, GnosisSafeL2.abi, provider)
	const threshold = await safeContract.getThreshold()
	return Number(threshold.toString())
}

export default getVotingThreshold
