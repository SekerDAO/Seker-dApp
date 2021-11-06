import {FunctionComponent, Ref} from "react"
import "./styles.scss"

const Paper: FunctionComponent<{className?: string; ref?: Ref<HTMLDivElement>}> = ({
	children,
	className,
	ref
}) => {
	return (
		<div className={`paper ${className ?? ""}`} ref={ref}>
			{children}
		</div>
	)
}

export default Paper
