import {FunctionComponent, InputHTMLAttributes, useRef} from "react"
import {ReactComponent as ArrowDown} from "../../../assets/icons/arrow-down.svg"
import {ReactComponent as ArrowUp} from "../../../assets/icons/arrow-up.svg"
import "./styles.scss"

const Input: FunctionComponent<
	{
		borders?: "bottom" | "all"
		number?: boolean
		validation?: string | null
		staticPlaceholder?: string
	} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">
> = ({
	borders = "all",
	number = false,
	validation,
	staticPlaceholder,
	step = 1,
	onChange,
	value,
	...inputProps
}) => {
	const ref = useRef<HTMLInputElement & EventTarget>(null)
	const handleArrowClick = (addedValue: number) => {
		if (onChange && !isNaN(Number(value))) {
			const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
				window.HTMLInputElement.prototype,
				"value"
			)?.set
			if (nativeInputValueSetter) {
				nativeInputValueSetter.call(ref.current, String(Number(value) + Number(addedValue)))
				const changeEvent = new Event("change", {bubbles: true})
				ref?.current?.dispatchEvent(changeEvent)
			}
		}
	}

	return (
		<div className="input">
			<div className="input__wrapper">
				{staticPlaceholder && <div className="input__static-placeholder">{staticPlaceholder}</div>}
				<input
					className={`input__field${borders === "all" ? " input__field--bordered" : ""}${
						validation ? " input__field--bad" : ""
					}`}
					type={number ? "number" : "text"}
					step={step}
					onChange={onChange}
					ref={ref}
					value={value}
					{...inputProps}
				/>
				{number && (
					<div className="input__custom-number-arrows">
						<div
							className="input__custom-number-arrow"
							onClick={() => handleArrowClick(Number(step))}
						>
							<ArrowUp width="14px" height="7px" />
						</div>
						<div className="input__custom-number-arrow" onClick={() => handleArrowClick(-step)}>
							<ArrowDown width="14px" height="7px" />
						</div>
					</div>
				)}
				{validation && <span className="input__validation">{validation}</span>}
			</div>
		</div>
	)
}

export default Input
