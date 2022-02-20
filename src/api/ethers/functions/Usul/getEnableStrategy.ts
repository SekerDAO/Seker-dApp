import {Contract} from "@ethersproject/contracts"
import Usul from "../../abis/Usul.json"
import {buildContractCall, SafeTransaction} from "../gnosisSafe/safeUtils"

const getEnableStrategy = (usulAddress: string, strategyAddress: string): SafeTransaction => {
	const usul = new Contract(usulAddress, Usul.abi)
	return buildContractCall(usul, "enableStrategy", [strategyAddress], 0)
}

export default getEnableStrategy
