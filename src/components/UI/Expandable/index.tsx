import {FunctionComponent, ReactElement, useState} from "react"
import {ReactComponent as ArrowDown} from "../../../assets/icons/arrow-down.svg"
import Paper from "../Paper"
import "./styles.scss"

const Expandable: FunctionComponent<{
	title: ReactElement | string
	subTitle?: string
}> = ({children, title}) => {
	const [expanded, setExpanded] = useState(false)

	return (
		<Paper className="expandable-container">
			<div
				className={`expandable-container__header${
					expanded ? " expandable-container__header--expanded" : ""
				}`}
			>
				{title}
				<ArrowDown
					className="expandable-container__arrow-down"
					width="14px"
					height="20px"
					onClick={() => setExpanded(prevState => !prevState)}
				/>
			</div>
			{expanded && <div className="expandable-container__content">{children}</div>}
		</Paper>
	)
}

export default Expandable
