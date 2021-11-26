import "./styles.scss"
import {FunctionComponent} from "react"

const DashboardHeader: FunctionComponent<{
	background?: string
}> = ({background, children}) => (
	<div
		className="dashboard-header"
		style={
			background
				? {
						backgroundImage: `url("${background}")`
				  }
				: {}
		}
	>
		{children}
	</div>
)

export default DashboardHeader
