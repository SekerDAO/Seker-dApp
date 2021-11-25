import {FunctionComponent} from "react"
import "./styles.scss"

const ProgressBar: FunctionComponent<{color: "green" | "red" | "black"}> = ({color}) => {
	return (
		<div className={`progress-bar progress-bar--${color}`}>
			<div className="progress-bar__background" />
			<div className="progress-bar__fill" />
		</div>
	)
}

export default ProgressBar
