import {FunctionComponent, useState} from "react"
import {ReactComponent as ArrowDown} from "../../../assets/icons/arrow-down.svg"
import Paper from "../Paper"
import "./styles.scss"

const Expandable: FunctionComponent<{title: string}> = ({children, title}) => {
	const [expanded, setExpanded] = useState(false)

	return (
		<Paper className="expandable-container">
			<div
				className={`expandable-container__header${
					expanded ? " expandable-container__header--expanded" : ""
				}`}
			>
				<span>{title}</span>
				<ArrowDown
					width="10px"
					height="20px"
					onClick={() => setExpanded(prevState => !prevState)}
				/>
			</div>
			{expanded && <div className="expandable-container__content">{children}</div>}
		</Paper>
	)
}

export default Expandable
