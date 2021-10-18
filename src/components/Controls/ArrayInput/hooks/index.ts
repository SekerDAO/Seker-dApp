import {useState, KeyboardEventHandler, ChangeEventHandler} from "react"
import type {ArrayInputOption, ArrayInputChangeListener} from "../"

type UseArrayInput = {
	inputValue: string
	value: readonly ArrayInputOption[]
	handleOptionRemove: OptionRemoveListener
	handleInputChange: InputChangeListener
	handleKeyDown: KeyboardEventHandler<HTMLDivElement>
}

type InputChangeListener = ChangeEventHandler<HTMLInputElement>
type OptionRemoveListener = (removeIndex: number) => void

const useArrayInput = ({onChange}: {onChange?: ArrayInputChangeListener}): UseArrayInput => {
	const [inputValue, setInputValue] = useState<string>("")
	const [value, setValue] = useState<readonly ArrayInputOption[]>([])

	const handleOptionRemove = (removeIndex: number) => {
		setValue(prevValue => prevValue.filter((option, index) => index === removeIndex))
	}

	const handleInputChange: InputChangeListener = event => {
		setInputValue(event.target.value)
	}

	const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = event => {
		if (!inputValue) return
		switch (event.key) {
			case "Enter":
			case "Tab":
				const newValue = [
					...value,
					{
						label: inputValue,
						value: inputValue
					}
				]
				setValue(newValue)
				setInputValue("")
				onChange && onChange(newValue)
				event.preventDefault()
		}
	}
	return {
		inputValue,
		value,
		handleInputChange,
		handleOptionRemove,
		handleKeyDown
	}
}

export default useArrayInput
