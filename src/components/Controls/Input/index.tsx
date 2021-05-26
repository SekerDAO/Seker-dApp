import React, {FunctionComponent, InputHTMLAttributes} from "react"
import "./styles.scss"

const Input: FunctionComponent<
	{
		borders: "bottom" | "all"
		number?: boolean
	} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">
> = ({borders, number = false, ...inputProps}) => {
	return (
		<input
			className={`input__field${borders === "all" ? " input__field--bordered" : ""}`}
			type={number ? "number" : "text"}
			{...inputProps}
		/>
	)
}

export default Input
