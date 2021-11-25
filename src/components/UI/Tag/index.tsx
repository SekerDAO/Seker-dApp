import {FunctionComponent} from "react"

const Tag: FunctionComponent<{
	variant: "active" | "executed" | "failed" | "canceled" | "executing" | "pending" | "queued"
}> = ({children, variant}) => {
	return <span className={`tag tag--${variant}`}>{children}</span>
}

export default Tag
