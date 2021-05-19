import React, {FunctionComponent, InputHTMLAttributes} from "react"
import "./styles.scss"

const Input: FunctionComponent<{borders: "bottom" | "all"} & InputHTMLAttributes<HTMLInputElement>> = ({
	borders,
	...inputProps
}) => {
	return (
		<input
			className={`input__field${borders === "all" ? " input__field--bordered" : ""}`}
			type="text"
			{...inputProps}
		/>
	)
}

export default Input
