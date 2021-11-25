import {FunctionComponent} from "react"
import BackButton from "../../Controls/Button/BackButton"

const ExpandDaoLayout: FunctionComponent<{
	title?: string
	description?: string
	onGoBack?: () => void
}> = ({title, description, onGoBack, children}) => (
	<>
		{(title || description) && (
			<div className="expand-dao__header">
				{onGoBack && <BackButton onClick={onGoBack} />}
				{title && <h2>{title}</h2>}
				{description && <p>{description}</p>}
			</div>
		)}
		<div className="expand-dao__content">{children}</div>
	</>
)

export default ExpandDaoLayout
