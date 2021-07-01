import React, {FunctionComponent, TextareaHTMLAttributes} from "react"
import "./styles.scss"

const Textarea: FunctionComponent<
	{
		borders: "bottom" | "all"
	} & TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({borders, ...inputProps}) => {
	return (
		<textarea
			className={`textarea__field${borders === "all" ? " textarea__field--bordered" : ""}`}
			{...inputProps}
		/>
	)
}

export default Textarea
