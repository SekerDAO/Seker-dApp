import React, {FunctionComponent, InputHTMLAttributes} from "react"
import "./styles.scss"

const Input: FunctionComponent<{label?: string} & InputHTMLAttributes<HTMLInputElement>> = ({label, ...inputProps}) => {
	return (
		<div className="input">
			{label && <label>{label}</label>}

			<input className="input__field" {...inputProps} />
		</div>
	)
}

export default Input
