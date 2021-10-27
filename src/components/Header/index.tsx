import {FunctionComponent} from "react"
import "./styles.scss"
import HeaderMenu from "./Menu"
import {Link} from "react-router-dom"
import {ReactComponent as LogoColored} from "../../assets/icons/logo.svg"

const Header: FunctionComponent = () => {
	return (
		<header className="header">
			<div className="header__logo">
				<Link to="/">
					<LogoColored width="230px" height="30px" />
				</Link>
			</div>
			<HeaderMenu />
		</header>
	)
}

export default Header
