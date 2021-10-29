import {FunctionComponent} from "react"
import "./styles.scss"

const Paper: FunctionComponent<{className?: string}> = ({children, className}) => {
	return <div className={`paper ${className ?? ""}`}>{children}</div>
}

export default Paper
