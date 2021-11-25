import {FunctionComponent} from "react"
import "./styles.scss"

const ProgressBar: FunctionComponent<{color: "green" | "red" | "black"}> = ({color}) => {
	return (
		<div className="progress-bar">
			<div className={`progress-bar__background progress-bar__background--${color}`} />
			<div className={`progress-bar__fill progress-bar__fill--${color}`} />
		</div>
	)
}

export default ProgressBar
