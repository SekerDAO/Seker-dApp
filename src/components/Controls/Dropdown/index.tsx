import {ReactElement, useRef} from "react"
import useClickOutside from "../../../hooks/useClickOutside"
import {ReactComponent as ArrowDown} from "../../../assets/icons/arrow-down.svg"
import "./styles.scss"

const Dropdown = <ItemValueType extends string | number>({
	isOpened,
	onClose,
	items,
	onTriggerClick,
	onItemClick,
	triggerText,
	className,
	borders = "all",
	selected,
	highlightSelected
}: {
	isOpened: boolean
	items: {value: ItemValueType; name: ReactElement | string}[]
	selected?: ItemValueType | null
	highlightSelected?: boolean
	triggerText: string | number
	onClose: () => void
	onTriggerClick: () => void
	onItemClick?: (itemId: ItemValueType) => void
	borders?: "all" | "none"
	className?: string
}): ReactElement => {
	const ref = useRef<HTMLDivElement | null>(null)
	useClickOutside(ref, onClose)

	const handleItemClick = (id: ItemValueType) => {
		if (onItemClick) {
			onItemClick(id)
		}
		onClose()
	}

	return (
		<div className={`dropdown${isOpened ? " dropdown--opened" : ""} ${className ?? ""}`} ref={ref}>
			<ul className={`dropdown__content dropdown__content--borders-${borders}`}>
				<li className="dropdown__trigger" onClick={onTriggerClick}>
					{triggerText}
					<ArrowDown
						className={`dropdown__arrow${isOpened ? " dropdown__arrow--open" : ""}`}
						width="20px"
						height="20px"
					/>
				</li>
				{isOpened && (
					<>
						{items.map(({value, name}) => (
							<li
								key={value}
								onClick={() => handleItemClick(value)}
								className={`dropdown__item${
									highlightSelected && value === selected ? " dropdown__item--selected" : ""
								}`}
							>
								{name}
							</li>
						))}
					</>
				)}
			</ul>
		</div>
	)
}

export default Dropdown
