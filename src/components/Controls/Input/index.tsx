import {FunctionComponent, InputHTMLAttributes} from "react"
import "./styles.scss"

const Input: FunctionComponent<
	{
		borders: "bottom" | "all"
		number?: boolean
		validation?: string | null
	} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">
> = ({borders, number = false, validation, ...inputProps}) => {
	return (
		<>
			<input
				className={`input__field${borders === "all" ? " input__field--bordered" : ""}${
					validation ? " input__field--bad" : ""
				}`}
				type={number ? "number" : "text"}
				{...inputProps}
			/>
			{validation && <span className="input__validation">{validation}</span>}
		</>
	)
}

export default Input
