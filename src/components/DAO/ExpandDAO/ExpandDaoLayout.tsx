import {FunctionComponent} from "react"

const ExpandDaoLayout: FunctionComponent<{
	title?: string
	description?: string
}> = ({title, description, children}) => (
	<>
		{(title || description) && (
			<div className="expand-dao__header">
				{title && <h2>{title}</h2>}
				{description && <p>{description}</p>}
			</div>
		)}
		<div className="expand-dao__content">{children}</div>
	</>
)

export default ExpandDaoLayout
