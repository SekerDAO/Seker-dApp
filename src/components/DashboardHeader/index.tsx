import React, {FunctionComponent} from "react"
import "./styles.scss"

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
