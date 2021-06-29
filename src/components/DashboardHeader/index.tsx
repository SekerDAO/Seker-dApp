import React, {FunctionComponent} from "react"
import "./styles.scss"
import Button from "../Controls/Button"

const DashboardHeader: FunctionComponent<{
	background?: string
	onEdit?: () => void
}> = ({background, onEdit}) => (
	<div
		className="dashboard-header"
		style={{
			backgroundImage: `url("${background ?? "/assets/Dashboard_Header.png"}")`
		}}
	>
		{onEdit && (
			<Button buttonType="secondary" onClick={onEdit}>
				Edit
			</Button>
		)}
	</div>
)

export default DashboardHeader
