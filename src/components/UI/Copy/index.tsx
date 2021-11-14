import {FunctionComponent} from "react"
import "./styles.scss"

const CopyField: FunctionComponent<{value?: string}> = ({children, value}) => {
	const handleCopy = () => {
		value && navigator.clipboard.writeText(value)
	}
	return (
		<div className="copy-field" onClick={handleCopy}>
			{children}
		</div>
	)
}

export default CopyField
