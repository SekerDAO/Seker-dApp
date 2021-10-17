import {useState, KeyboardEventHandler} from "react"
import type {ArrayInputOption, ArrayInputChangeListener} from "../"

type UseArrayInput = {
	inputValue: string
	value: readonly ArrayInputOption[]
	handleChange: ArrayInputChangeListener
	handleInputChange: InputChangeListener
	handleKeyDown: KeyboardEventHandler<HTMLDivElement>
}

type InputChangeListener = (newInputValue: string) => void

const useArrayInput = ({onChange}: {onChange?: ArrayInputChangeListener}): UseArrayInput => {
	const [inputValue, setInputValue] = useState<string>("")
	const [value, setValue] = useState<readonly ArrayInputOption[]>([])

	const handleChange: ArrayInputChangeListener = newValue => {
		setValue(newValue)
		onChange && onChange(newValue)
	}

	const handleInputChange = (newInputValue: string) => {
		setInputValue(newInputValue)
	}

	const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = event => {
		if (!inputValue) return
		switch (event.key) {
			case "Enter":
			case "Tab":
				setValue([
					...value,
					{
						label: inputValue,
						value: inputValue
					}
				])
				setInputValue("")
				event.preventDefault()
		}
	}
	return {
		inputValue,
		value,
		handleChange,
		handleInputChange,
		handleKeyDown
	}
}

export default useArrayInput
