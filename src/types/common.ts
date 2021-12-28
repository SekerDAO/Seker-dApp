import {AbiFunction} from "./abi"

export type PrebuiltTx = {
	address: string
	contractMethods: AbiFunction[]
	selectedMethodIndex: number
	args: (string | string[])[]
	value?: number // TODO: Store transaction value
}
