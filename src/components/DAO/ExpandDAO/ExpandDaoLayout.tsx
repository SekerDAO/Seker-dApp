import {FunctionComponent} from "react"

const ExpandDaoLayout: FunctionComponent<{
	title: string
	description?: string
}> = ({title, description, children}) => (
	<>
		<div className="expand-dao__header">
			<h2>{title}</h2>
			{description && <p>{description}</p>}
		</div>
		<div className="expand-dao__content">{children}</div>
	</>
)

export default ExpandDaoLayout
