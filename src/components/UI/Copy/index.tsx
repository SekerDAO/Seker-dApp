import {FunctionComponent} from "react"
import {ReactComponent as CopyIcon} from "../../../assets/icons/copy-white.svg"
import {toastSuccess} from "../Toast"
import "./styles.scss"

const Copy: FunctionComponent<{value?: string | null}> = ({children, value}) => {
	const handleCopy = () => {
		if (value) {
			navigator.clipboard.writeText(value)
			toastSuccess("Value copied to clipboard")
		}
	}
	return (
		<div className="copy-field" onClick={handleCopy}>
			{children}
			{value && <CopyIcon width="18px" height="20px" />}
		</div>
	)
}

export default Copy
