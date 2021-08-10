import {Contract} from "@ethersproject/contracts"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import {Web3Provider} from "@ethersproject/providers"

const getVotingThreshold = async (
	gnosisAddress: string,
	provider: Web3Provider
): Promise<number> => {
	const safeContract = new Contract(gnosisAddress, GnosisSafeL2.abi, provider)
	const threshold = await safeContract.getThreshold()
	return Number(threshold.toString())
}

export default getVotingThreshold
