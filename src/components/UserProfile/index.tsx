import React, {FunctionComponent} from "react"
import "./styles.scss"

const UserProfile: FunctionComponent<{name: string}> = ({name}) => (
	<div className="userProfile">
		<ul>
			<li>
				<div className="img">
					<img src="/assets/user.png" />
				</div>
			</li>
			<li>
				<span className="displayName">{name}</span>
			</li>
		</ul>
	</div>
)

export default UserProfile
