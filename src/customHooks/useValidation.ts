import {useEffect, useRef, useState} from "react"
import {throttle} from "../utlls"

const useValidation = (
	value: string,
	validators: ((val: string) => Promise<string | null>)[]
): {
	validation: string | null
	validate: () => Promise<string | null>
} => {
	const [validation, setValidation] = useState<string | null>(null)

	const validate = async (val: string) => {
		const responses = await Promise.all(validators.map(async validator => validator(val)))
		const newValidation = responses.reduce((acc, cur) => acc || cur, null)
		setValidation(newValidation)
		return newValidation
	}
	const throttledValidate = useRef(throttle(validate, 500))

	useEffect(() => {
		throttledValidate.current(value)
	}, [value, validators])

	return {
		validate: () => validate(value),
		validation
	}
}

export default useValidation
