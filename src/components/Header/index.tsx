import {FunctionComponent} from "react"
import "./styles.scss"
import HeaderMenu from "./Menu"
import {Link} from "react-router-dom"
import LogoColored from "../../icons/LogoColored"

const Header: FunctionComponent = () => {
	return (
		<header className="header">
			<div className="header__logo">
				<Link to="/">
					<LogoColored />
				</Link>
			</div>
			<HeaderMenu />
		</header>
	)
}

export default Header
