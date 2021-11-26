import {Contract} from "@ethersproject/contracts"
import {JsonRpcProvider} from "@ethersproject/providers"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"

const getOwners = async (gnosisAddress: string, provider: JsonRpcProvider): Promise<string[]> => {
	const safeContract = new Contract(gnosisAddress, GnosisSafeL2.abi, provider)
	const addresses: string[] = await safeContract.getOwners()
	return addresses.map(addr => addr.toLowerCase())
}

export default getOwners
