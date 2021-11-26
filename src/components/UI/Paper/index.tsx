import "./styles.scss"
import {FunctionComponent, Ref} from "react"

const Paper: FunctionComponent<{className?: string; innerRef?: Ref<HTMLDivElement>}> = ({
	children,
	className,
	innerRef
}) => (
	<div className={`paper ${className ?? ""}`} ref={innerRef}>
		{children}
	</div>
)

export default Paper
