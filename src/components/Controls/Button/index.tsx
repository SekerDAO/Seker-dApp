import React, {ButtonHTMLAttributes, FunctionComponent} from "react"
import "./styles.scss"

const Button: FunctionComponent<
	{
		buttonType?: "primary" | "secondary"
		extraClassName?: string
	} & ButtonHTMLAttributes<HTMLButtonElement>
> = ({buttonType = "primary", extraClassName, children, ...buttonProps}) => {
	return (
		<button
			className={`btn ${buttonType === "primary" ? "btn--primary" : "btn--secondary"} ${
				extraClassName ?? ""
			}`}
			{...buttonProps}
		>
			{children}
		</button>
	)
}

export default Button
