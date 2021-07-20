import React, {FunctionComponent, SelectHTMLAttributes} from "react"
import "./styles.scss"

const Select: FunctionComponent<
	{
		options: {name: string; value: string | number}[]
		label?: string
		fullWidth?: boolean
	} & SelectHTMLAttributes<HTMLSelectElement>
> = ({options, label, fullWidth, ...selectProps}) => {
	if (!Array.isArray(options) || options.length < 1) return null

	return (
		<div className={`select${fullWidth ? " select--full-width" : ""}`}>
			{label && <label>{label}</label>}

			<select className="select__field" {...selectProps}>
				{options.map((option, index) => {
					const {value, name} = option

					return (
						<option key={index} value={value}>
							{name}
						</option>
					)
				})}
			</select>
		</div>
	)
}

export default Select
