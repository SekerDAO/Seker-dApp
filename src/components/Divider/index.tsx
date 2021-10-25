import {FunctionComponent} from "react"
import "./styles.scss"

const Divider: FunctionComponent<{type?: "horizontal" | "vertical"}> = ({type = "horizontal"}) => {
	return <div className={`divider divider--${type}`} />
}

export default Divider
