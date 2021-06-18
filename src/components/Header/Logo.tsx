import React, {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import Logo from "../../icons/Logo"

const HeaderLogo: FunctionComponent = () => (
	<div className="header__logo">
		<Link to="/">
			<Logo />
		</Link>
	</div>
)

export default HeaderLogo
