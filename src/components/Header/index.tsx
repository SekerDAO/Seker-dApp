import React, {FunctionComponent} from "react"
import "./styles.scss"
import HeaderLogo from "./Logo"
import HeaderMenu from "./Menu"

const Header: FunctionComponent<{background: boolean}> = ({background}) => {
	return (
		<header
			className="header"
			style={background ? {backgroundImage: `url("/assets/Dashboard_Header.png")`} : undefined}
		>
			<HeaderLogo />
			<HeaderMenu />
		</header>
	)
}

export default Header
