import {FunctionComponent} from "react"
import "./styles.scss"

const ProgressBar: FunctionComponent<{color: "green" | "red" | "grey"; value: number}> = ({
	color,
	value
}) => (
	<div className="progress-bar">
		<div className={`progress-bar__background progress-bar__background--${color}`} />
		<div
			className={`progress-bar__fill progress-bar__fill--${color}`}
			style={{width: `${value}%`}}
		/>
	</div>
)

export default ProgressBar
