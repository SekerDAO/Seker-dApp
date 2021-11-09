import {FunctionComponent, InputHTMLAttributes} from "react"
import "./styles.scss"

const Input: FunctionComponent<
	{
		borders?: "bottom" | "all"
		number?: boolean
		validation?: string | null
		staticPlaceholder?: string
	} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">
> = ({borders = "all", number = false, validation, staticPlaceholder, ...inputProps}) => {
	return (
		<div className="input">
			{staticPlaceholder && <div className="input__static-placeholder">{staticPlaceholder}</div>}
			<input
				className={`input__field${borders === "all" ? " input__field--bordered" : ""}${
					validation ? " input__field--bad" : ""
				}`}
				type={number ? "number" : "text"}
				{...inputProps}
			/>
			{validation && <span className="input__validation">{validation}</span>}
		</div>
	)
}

export default Input
