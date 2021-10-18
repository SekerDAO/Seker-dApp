import {FunctionComponent} from "react"
import CloseIcon from "../../../assets/icons/CloseIcon"
import Input from "../Input"
import Button from "../Button"
import useArrayInput from "./hooks"
import "./styles.scss"

export type ArrayInputOption = {
	value: string
	label: string
}

export type ArrayInputChangeListener = (newValue: ArrayInputChangeValue) => void
export type ArrayInputChangeValue = ArrayInputOption[]

const ArrayInput: FunctionComponent<{
	onChange: ArrayInputChangeListener
	validation?: string | null
	borders?: "all" | "bottom"
}> = ({onChange, borders, validation}) => {
	const {handleInputChange, handleKeyDown, handleOptionRemove, value, inputValue} = useArrayInput({
		onChange
	})
	return (
		<section className="array-input-container">
			<Input
				onChange={handleInputChange}
				value={inputValue}
				onKeyDown={handleKeyDown}
				placeholder="Type value and press enter or tab..."
				borders={borders || "all"}
			/>
			{validation && <span>{validation}</span>}
			{value.map((option, index) => (
				<section key={option.value}>
					<span>{option.label}</span>
					<Button onClick={() => handleOptionRemove(index)}>
						<CloseIcon />
					</Button>
				</section>
			))}
		</section>
	)
}

export default ArrayInput
