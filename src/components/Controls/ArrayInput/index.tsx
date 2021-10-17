import {FunctionComponent} from "react"
import CreatableSelect from "react-select/creatable"
import {OnChangeValue} from "react-select"
import useArrayInput from "./hooks"
import "./styles.scss"

export type ArrayInputOption = {
	label: string
	value: string
}

export type ArrayInputChangeListener = (newValue: ArrayInputChangeValue) => void
export type ArrayInputChangeValue = OnChangeValue<ArrayInputOption, true>

const components = {
	DropdownIndicator: null
}

const ArrayInput: FunctionComponent<{
	onChange: ArrayInputChangeListener
	validation?: string | null
}> = ({onChange}) => {
	const {handleChange, handleInputChange, handleKeyDown, value, inputValue} = useArrayInput({
		onChange
	})
	return (
		<CreatableSelect
			className="array-input-container"
			isMulti
			onChange={handleChange}
			value={value}
			components={components}
			inputValue={inputValue}
			isClearable
			menuIsOpen={false}
			onInputChange={handleInputChange}
			onKeyDown={handleKeyDown}
			placeholder="Type value and press enter or tab..."
		/>
	)
}

export default ArrayInput
