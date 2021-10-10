import {Contract} from "@ethersproject/contracts"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import {JsonRpcProvider} from "@ethersproject/providers"

const getOwners = async (gnosisAddress: string, provider: JsonRpcProvider): Promise<string[]> => {
	const safeContract = new Contract(gnosisAddress, GnosisSafeL2.abi, provider)
	const addresses: string[] = await safeContract.getOwners()
	return addresses.map(addr => addr.toLowerCase())
}

export default getOwners
