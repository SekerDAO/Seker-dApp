import {AbiDataType, AbiScalar} from "../types/abi"
import {isAddress} from "@ethersproject/address"
import {BigNumber} from "@ethersproject/bignumber"

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

export const formatDate = (isoString: string): string => {
	const date = isoString.split("T")[0]
	const [year, month, day] = date.split("-")
	return `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year.slice(2)}`
}

export const formatTimeDifference = (ms: number): string => {
	const hours = Math.floor(ms / 3600000)
	const minutes = Math.floor((ms % 3600000) / 60000)
	return `${hours > 0 ? `${hours} h ` : ""}${minutes} m`
}

const validateScalarArgument = (arg: string | readonly string[], argType: AbiDataType): boolean => {
	if (argType.endsWith("[]") || arg instanceof Array) {
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

export const validateArgument = (
	arg: string | readonly string[],
	argType: AbiDataType
): boolean => {
	if (argType.endsWith("[]") && arg instanceof Array) {
		return arg.reduce(
			(acc: boolean, cur) =>
				acc && validateScalarArgument(cur, argType.slice(0, -2) as AbiDataType),
			true
		)
	} else {
		return validateScalarArgument(arg, argType)
	}
}

const prepareScalarArgument = (arg: string, dataType: AbiScalar): string | boolean | BigNumber => {
	if (
		dataType.startsWith("uint") ||
		dataType.startsWith("int") ||
		dataType.startsWith("ufixed") ||
		dataType.startsWith("fixed")
	) {
		return BigNumber.from(arg)
	}
	if (dataType === "bool") {
		return arg === "true"
	}
	return arg
}

export const prepareArguments = (
	args: Array<string | readonly string[]>,
	dataTypes: AbiDataType[]
): (string | string[] | boolean | boolean[] | BigNumber | BigNumber[])[] =>
	args.map((arg, index) => {
		if ((dataTypes[index].endsWith("[]") && arg instanceof Array) || arg instanceof Array) {
			return arg.map(splittedArg =>
				prepareScalarArgument(splittedArg, dataTypes[index].slice(0, -2) as AbiScalar)
			) as string[] | boolean[] | BigNumber[]
		}
		return prepareScalarArgument(arg, dataTypes[index] as AbiScalar)
	})
