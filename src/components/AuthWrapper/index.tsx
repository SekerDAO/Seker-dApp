import "./styles.scss"
import {FunctionComponent} from "react"

const AuthWrapper: FunctionComponent<{
	headline: string
}> = ({headline, children}) => (
	<div className="authWrapper">
		<div className="wrap">
			{headline && <h2>{headline}</h2>}

			<div className="children">{children}</div>
		</div>
	</div>
)

export default AuthWrapper
