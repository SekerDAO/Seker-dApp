import {ButtonHTMLAttributes, FunctionComponent} from "react"
import "./styles.scss"

const Button: FunctionComponent<
	{
		buttonType?: "primary" | "secondary" | "link"
		extraClassName?: string
	} & ButtonHTMLAttributes<HTMLButtonElement>
> = ({buttonType = "primary", extraClassName, children, ...buttonProps}) => {
	return (
		<button className={`btn btn--${buttonType} ${extraClassName ?? ""}`} {...buttonProps}>
			{children}
		</button>
	)
}

export default Button
