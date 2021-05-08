import React, {FunctionComponent} from "react"
import "./styles.scss"

const AuthWrapper: FunctionComponent<{
	headline: string
}> = ({headline, children}) => {
	return (
		<div className="authWrapper">
			<div className="wrap">
				{headline && <h2>{headline}</h2>}

				<div className="children">{children}</div>
			</div>
		</div>
	)
}

export default AuthWrapper
