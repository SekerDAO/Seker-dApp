import {ReactElement, SelectHTMLAttributes, useState} from "react"
import Dropdown from "../Dropdown"
import "./styles.scss"

const Select = <ValueType extends string | number>({
	options,
	fullWidth,
	placeholder,
	value,
	onChange
}: {
	options: {name: string; value: ValueType}[]
	fullWidth?: boolean
	placeholder: string
	onChange: (newValue: ValueType) => void
	value?: ValueType | null
} & Omit<
	SelectHTMLAttributes<HTMLSelectElement>,
	"options" | "onChange" | "value"
>): ReactElement => {
	const [isOpened, setIsOpened] = useState(false)

	const closeMenu = () => {
		setIsOpened(false)
	}

	const handleDropdownTriggerClick = () => {
		setIsOpened(prevState => !prevState)
	}

	const handleItemClick = (newValue: ValueType) => {
		onChange(newValue)
	}

	const triggerText = isOpened
		? placeholder
		: value != undefined && options.find(option => option.value === value)?.name

	return (
		<Dropdown<ValueType>
			className={`select__field${fullWidth ? " select__field--full-width" : ""}`}
			isOpened={isOpened}
			triggerText={triggerText || placeholder}
			selected={value}
			highlightSelected={true}
			onClose={closeMenu}
			onItemClick={handleItemClick}
			onTriggerClick={handleDropdownTriggerClick}
			items={options}
		/>
	)
}

export default Select
