import React, {FunctionComponent} from "react"
import UserProfile from "../UserProfile"
import "./styles.scss"

const VerticalNav: FunctionComponent = ({children}) => (
	<div className="verticalNav">
		{/* TODO */}
		<UserProfile name="" />
		<div className="menu">{children}</div>
	</div>
)

export default VerticalNav
