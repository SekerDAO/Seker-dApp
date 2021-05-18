import React, {ButtonHTMLAttributes, FunctionComponent} from "react"
import "./styles.scss"

const Button: FunctionComponent<
	{
		buttonType?: "primary" | "secondary"
	} & ButtonHTMLAttributes<HTMLButtonElement>
> = ({buttonType = "primary", children, ...buttonProps}) => {
	return (
		<button className={`btn ${buttonType === "primary" ? "btn--primary" : "btn--secondary"}`} {...buttonProps}>
			{children}
		</button>
	)
}

export default Button
