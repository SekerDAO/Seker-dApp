import {FunctionComponent} from "react"
import "./styles.scss"

const Skeleton: FunctionComponent<{
	variant?: "text" | "circular" | "rectangular" // TODO: Once all old usages of Loader replaced - make this prop mandatory
	animation?: "pulse" | "wave" | false
	width?: number | string
	height?: number | string
	className?: string
}> = ({width, height, variant = "text", animation = "pulse", className}) => (
	<div
		style={{width, height}}
		className={`skeleton skeleton--${variant}${animation ? ` skeleton--${animation}` : ""} ${
			className ?? ""
		}`}
	/>
)

export default Skeleton
