import {AbiFunction} from "./abi"

export type PrebuiltTx = {
	address: string
	contractMethods: AbiFunction[]
	selectedMethodIndex: number
	args: (string | string[])[]
	delegateCall?: boolean
	value?: number // TODO: Store transaction value
}
