import React, {FunctionComponent} from "react"
import "./styles.scss"
import HeaderLogo from "./Logo"
import HeaderMenu from "./Menu"

const Header: FunctionComponent = () => {
	return (
		<header className="header">
			<HeaderLogo />
			<HeaderMenu />
		</header>
	)
}

export default Header
