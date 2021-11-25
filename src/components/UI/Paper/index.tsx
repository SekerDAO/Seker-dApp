import {FunctionComponent, Ref} from "react"
import "./styles.scss"

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
