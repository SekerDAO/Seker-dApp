import React, {FunctionComponent, InputHTMLAttributes} from "react"
import "./styles.scss"

const FormInput: FunctionComponent<{label?: string} & InputHTMLAttributes<HTMLInputElement>> = ({
	label,
	...inputProps
}) => {
	return (
		<div className="formRow">
			{label && <label>{label}</label>}

			<input className="formInput" {...inputProps} />
		</div>
	)
}

export default FormInput
