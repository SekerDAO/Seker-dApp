import "./styles.scss"
import {FunctionComponent, TextareaHTMLAttributes} from "react"

const Textarea: FunctionComponent<
	{
		borders?: "bottom" | "all"
		validation?: string | null
	} & TextareaHTMLAttributes<HTMLTextAreaElement>
> = ({borders = "all", validation, ...inputProps}) => (
	<>
		<textarea
			className={`textarea__field${borders === "all" ? " textarea__field--bordered" : ""}${
				validation ? " textarea__field--bad" : ""
			}`}
			{...inputProps}
		/>
		{validation && <span className="textarea__validation">{validation}</span>}
	</>
)

export default Textarea
