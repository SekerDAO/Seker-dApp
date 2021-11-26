import "./styles.scss"
import {ButtonHTMLAttributes, FunctionComponent} from "react"

const Button: FunctionComponent<
	{
		buttonType?: "primary" | "secondary" | "link"
		extraClassName?: string
	} & ButtonHTMLAttributes<HTMLButtonElement>
> = ({buttonType = "primary", extraClassName, children, ...buttonProps}) => (
	<button className={`btn btn--${buttonType} ${extraClassName ?? ""}`} {...buttonProps}>
		{children}
	</button>
)

export default Button
