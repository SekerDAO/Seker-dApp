import React, {FunctionComponent} from "react"
import "./styles.scss"
import HeaderMenu from "./Menu"
import {Link} from "react-router-dom"
import Logo from "../../icons/Logo"
import {BLACK} from "../../constants/colors"

const Header: FunctionComponent = () => {
	return (
		<header className="header">
			<div className="header__logo">
				<Link to="/">
					<Logo width={150} height={30} fill={BLACK} />
				</Link>
			</div>
			<HeaderMenu />
		</header>
	)
}

export default Header
