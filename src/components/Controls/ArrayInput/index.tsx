import {FunctionComponent, useState, ChangeEventHandler, KeyboardEventHandler} from "react"
import CloseIcon from "../../../assets/icons/CloseIcon"
import Input from "../Input"
import Button from "../Button"
import "./styles.scss"

const ArrayInput: FunctionComponent<{
	onAdd: (newValue: string) => void
	onRemove: (indexToRemove: number) => void
	items: string[]
	validation?: string | null
	borders?: "all" | "bottom"
	placeholder?: string
}> = ({
	onAdd,
	onRemove,
	items,
	validation,
	borders = "all",
	placeholder = "Type value and press enter or tab..."
}) => {
	const [inputValue, setInputValue] = useState<string>("")

	const handleInputChange: ChangeEventHandler<HTMLInputElement> = event => {
		setInputValue(event.target.value)
	}

	const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = event => {
		if (!inputValue || validation) return
		if (event.key === "Enter" || event.key === "Tab") {
			event.preventDefault()
			onAdd(inputValue)
			setInputValue("")
		}
	}

	return (
		<div className="array-input">
			<Input
				onChange={handleInputChange}
				value={inputValue}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				borders={borders}
				validation={validation}
			/>
			{items && (
				<div className="array-input__options-wrapper">
					{items.map((item, index) => (
						<div key={index} className="array-input__option">
							<span>{item}</span>
							<Button
								buttonType="secondary"
								onClick={() => onRemove(index)}
								extraClassName="array-input__remove-button"
							>
								<CloseIcon />
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default ArrayInput
