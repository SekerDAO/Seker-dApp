import React, {FunctionComponent} from "react"
import {Link} from "react-router-dom"

const HeaderLogo: FunctionComponent = () => (
	<div className="header__logo">
		<Link to="/">
			<img src="/assets/logo.png" alt="Sample logo" />
		</Link>
		<h3>TokenWalk</h3>
	</div>
)

export default HeaderLogo
