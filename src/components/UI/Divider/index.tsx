import "./styles.scss"
import {FunctionComponent} from "react"

const Divider: FunctionComponent<{type?: "horizontal" | "vertical"}> = ({type = "horizontal"}) => (
	<div className={`divider divider--${type}`} />
)

export default Divider
