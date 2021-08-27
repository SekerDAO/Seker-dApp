import {AbiDataType} from "../types/abi"
import {isAddress} from "@ethersproject/address"

export const capitalize = (str: string): string => `${str[0].toUpperCase()}${str.slice(1)}`

export const throttle = <T extends unknown[]>(
	func: (...args: T) => unknown,
	delay: number
): ((...args: T) => void) => {
	let timer: NodeJS.Timeout | null = null
	return (...args): void => {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => {
			func(...args)
		}, delay)
	}
}

export const formatTimeDifference = (ms: number): string => {
	const hours = Math.floor(ms / 3600000)
	const minutes = Math.floor((ms % 3600000) / 60000)
	return `${hours > 0 ? `${hours} h ` : ""}${minutes} m`
}

const validateScalarArgument = (arg: string, argType: AbiDataType): boolean => {
	if (argType.endsWith("[]")) {
		throw new Error("Trying to validate array argument type as a scalar one")
	}
	if (argType.startsWith("bytes") || argType === "string") {
		return true
	}
	if (argType === "bool") {
		return arg === "true" || arg === "false"
	}
	if (argType.startsWith("fixed")) {
		return !isNaN(Number(arg))
	}
	if (argType.startsWith("int")) {
		return !isNaN(Number(arg)) && Number(arg) === Math.round(Number(arg))
	}
	if (argType.startsWith("ufixed")) {
		return !isNaN(Number(arg)) && Number(arg) >= 0
	}
	if (argType.startsWith("uint")) {
		return !isNaN(Number(arg)) && Number(arg) >= 0 && Number(arg) === Math.round(Number(arg))
	}
	if (argType === "address") {
		return isAddress(arg)
	}
	console.error(`Unexpected argument type ${argType}, skipping validation`)
	return true
}

export const validateArgument = (arg: string, argType: AbiDataType): boolean => {
	if (argType.endsWith("[]")) {
		const args = arg.split(",")
		return args.reduce(
			(acc: boolean, cur) => acc && validateScalarArgument(cur, argType.slice(-2) as AbiDataType),
			true
		)
	} else {
		return validateScalarArgument(arg, argType)
	}
}
