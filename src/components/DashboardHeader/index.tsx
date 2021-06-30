import React, {FunctionComponent} from "react"
import "./styles.scss"

const DashboardHeader: FunctionComponent<{
	background?: string
}> = ({background, children}) => (
	<div
		className="dashboard-header"
		style={{
			backgroundImage: `url("${background ?? "/assets/Dashboard_Header.png"}")`
		}}
	>
		{children}
	</div>
)

export default DashboardHeader
