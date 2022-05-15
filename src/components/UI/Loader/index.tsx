import {FunctionComponent} from "react"
import "./styles.scss"

const Loader: FunctionComponent = () => (
	<div className="loader">
		<div className="lds-default">
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
			<div />
		</div>
	</div>
)

export default Loader
