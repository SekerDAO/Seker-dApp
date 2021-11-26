import {FunctionComponent} from "react"
import "./styles.scss"

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
