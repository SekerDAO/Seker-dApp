import {useState, KeyboardEventHandler, ChangeEventHandler} from "react"
import type {ArrayInputChangeListener, ArrayInputValue} from "../"

type UseArrayInput = {
	inputValue: string
	handleInputChange: InputChangeListener
	handleKeyDown: KeyboardEventHandler<HTMLDivElement>
}

type InputChangeListener = ChangeEventHandler<HTMLInputElement>

const useArrayInput = ({
	onChange,
	value
}: {
	onChange: ArrayInputChangeListener
	value: ArrayInputValue
}): UseArrayInput => {
	const [inputValue, setInputValue] = useState<string>("")

	const handleInputChange: InputChangeListener = event => {
		setInputValue(event.target.value)
	}

	const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = event => {
		if (!inputValue) return
		switch (event.key) {
			case "Enter":
			case "Tab":
				const newValue = [...value, inputValue]
				setInputValue("")
				onChange(newValue)
				event.preventDefault()
		}
	}
	return {
		inputValue,
		handleInputChange,
		handleKeyDown
	}
}

export default useArrayInput
