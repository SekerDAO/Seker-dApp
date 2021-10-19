import {FunctionComponent} from "react"
import CloseIcon from "../../../assets/icons/CloseIcon"
import Input from "../Input"
import Button from "../Button"
import useArrayInput from "./hooks"
import "./styles.scss"

export type ArrayInputChangeListener = (newValue: ArrayInputValue) => void
export type ArrayInputValue = string[]

const ArrayInput: FunctionComponent<{
	onChange: ArrayInputChangeListener
	onRemove: (indexToRemove: number) => void
	value: string[]
	validation?: string | null
	borders?: "all" | "bottom"
}> = ({onChange, onRemove, value, borders, validation}) => {
	const {handleInputChange, handleKeyDown, inputValue} = useArrayInput({
		onChange,
		value
	})
	return (
		<section className="array-input-container">
			<Input
				onChange={handleInputChange}
				value={inputValue}
				onKeyDown={handleKeyDown}
				placeholder="Type value and press enter or tab..."
				borders={borders || "all"}
				validation={validation}
			/>
			{value.map((option, index) => (
				<section key={option} className="array-input-container__option">
					<span>{option}</span>
					<Button
						buttonType="secondary"
						onClick={() => onRemove(index)}
						extraClassName="array-input-container__option__remove-button"
					>
						<CloseIcon />
					</Button>
				</section>
			))}
		</section>
	)
}

export default ArrayInput
