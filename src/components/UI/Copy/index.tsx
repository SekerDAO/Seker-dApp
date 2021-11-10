import {FunctionComponent} from "react"

const Copy: FunctionComponent<{text: string; value: string}> = ({text, value}) => {
	const handleCopy = () => {
		navigator.clipboard.writeText(value)
	}
	return (
		<div className="copy" onClick={handleCopy}>
			{text}
		</div>
	)
}

export default Copy
