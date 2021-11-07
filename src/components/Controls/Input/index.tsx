import {FunctionComponent, InputHTMLAttributes, useRef} from "react"
import {ReactComponent as ArrowUp} from "../../../assets/icons/arrow-up.svg"
import {ReactComponent as ArrowDown} from "../../../assets/icons/arrow-down.svg"
import "./styles.scss"

const Input: FunctionComponent<
	{
		borders: "bottom" | "all"
		number?: boolean
		validation?: string | null
		staticPlaceholder?: string
	} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">
> = ({borders, number = false, validation, staticPlaceholder, ...inputProps}) => {
	const ref = useRef<HTMLInputElement>(null)
	return (
		<div className="input">
			{staticPlaceholder && <div className="input__static-placeholder">{staticPlaceholder}</div>}
			<input
				className={`input__field${borders === "all" ? " input__field--bordered" : ""}${
					validation ? " input__field--bad" : ""
				}`}
				type={number ? "number" : "text"}
				ref={ref}
				{...inputProps}
			/>
			{number && (
				<div className="input__custom-number-arrows">
					<ArrowUp width="14px" height="7px" onClick={() => ref.current?.stepUp()} />
					<ArrowDown width="14px" height="7px" onClick={() => ref.current?.stepDown()} />
				</div>
			)}
			{validation && <span className="input__validation">{validation}</span>}
		</div>
	)
}

export default Input
