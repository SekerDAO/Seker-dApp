import "./styles.scss"
import {FunctionComponent} from "react"

const Tag: FunctionComponent<{
	variant:
		| "active"
		| "executed"
		| "failed"
		| "canceled"
		| "executing"
		| "pending"
		| "queued"
		| "outdated"
}> = ({children, variant}) => <span className={`tag tag--${variant}`}>{children}</span>

export default Tag
