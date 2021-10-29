import {FunctionComponent, SelectHTMLAttributes, useState} from "react"
import Dropdown from "../../Dropdown"
import "./styles.scss"

const Select: FunctionComponent<
	{
		options: {name: string; value: string | number}[]
		fullWidth?: boolean
		placeholder: string
		onChange: (newValue: string | number) => void
		value?: string | number | null
	} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "options" | "onChange" | "value">
> = ({options, fullWidth, placeholder, value, onChange}) => {
	const [isOpened, setIsOpened] = useState(false)

	const closeMenu = () => {
		setIsOpened(false)
	}

	const handleDropdownTriggerClick = () => {
		setIsOpened(prevState => !prevState)
	}

	const handleItemClick = (newValue: string | number) => {
		onChange(newValue)
	}

	const triggerText = isOpened
		? placeholder
		: value && options.find(option => option.value === value)?.name

	return (
		<Dropdown
			className={`select__field${fullWidth ? " select__field--full-width" : ""}`}
			isOpened={isOpened}
			triggerText={triggerText || placeholder}
			selected={value}
			highlightSelected={true}
			onClose={closeMenu}
			onItemClick={handleItemClick}
			onTriggerClick={handleDropdownTriggerClick}
			items={options}
			borders="all"
		/>
	)
}

export default Select
