import {FunctionComponent, InputHTMLAttributes} from "react"
import "./styles.scss"

const RadioButton: FunctionComponent<
	{
		label: string
		id: string
	} & InputHTMLAttributes<HTMLInputElement>
> = ({label, id, ...inputProps}) => (
	<>
		<input id={id} type="radio" {...inputProps} className="radio" />
		<label htmlFor={id} className="radio__label">
			{label}
		</label>
	</>
)

export default RadioButton
