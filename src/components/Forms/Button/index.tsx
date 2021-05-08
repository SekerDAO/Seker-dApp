import React, {ButtonHTMLAttributes, FunctionComponent} from "react"
import "./styles.scss"

const Button: FunctionComponent<ButtonHTMLAttributes<HTMLButtonElement>> = ({children, ...buttonProps}) => {
	return (
		<button className="btn" {...buttonProps}>
			{children}
		</button>
	)
}

export default Button
