import {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import {ReactComponent as LogoColored} from "../../assets/icons/logo.svg"
import HeaderMenu from "./HeaderMenu"
import "./styles.scss"

const Header: FunctionComponent = () => (
	<header className="header">
		<div className="header__logo">
			<Link to="/">
				<LogoColored width="230px" height="30px" />
			</Link>
		</div>
		<HeaderMenu />
	</header>
)

export default Header
