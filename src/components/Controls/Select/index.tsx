import {FunctionComponent, SelectHTMLAttributes, useState, useMemo} from "react"
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
	const [open, setOpen] = useState(false)
	const mappedOptions = useMemo(
		() => options.map(option => ({id: option.value, content: option.name})),
		[options]
	)

	const closeMenu = () => {
		setOpen(false)
	}

	const handleDropdownTriggerClick = () => {
		setOpen(prevState => !prevState)
	}

	const handleItemClick = (newValue: string | number) => {
		onChange(newValue)
	}

	const triggerText = open
		? placeholder
		: value && options.find(option => option.value === value)?.name

	return (
		<Dropdown
			className={`select__field${fullWidth ? " select__field--full-width" : ""}`}
			open={open}
			triggerText={triggerText || placeholder}
			selected={value}
			highlightSelected={true}
			onClose={closeMenu}
			onItemClick={handleItemClick}
			onTriggerClick={handleDropdownTriggerClick}
			items={mappedOptions}
			borders="all"
		/>
	)
}

export default Select
