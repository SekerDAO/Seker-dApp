import {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import Logo from "../../assets/icons/Logo"
import TwitterIcon from "../../assets/icons/TwitterIcon"
import DiscordIcon from "../../assets/icons/DiscordIcon"
import "./styles.scss"

const Footer: FunctionComponent = () => {
	return (
		<footer className="footer">
			<div className="footer__wrap">
				<div className="footer__col">
					<Link to="/">
						<Logo />
					</Link>
					© Hyphal 2021
					<div className="footer__socials">
						<a target="_blank" rel="noopener noreferrer" href="https://twitter.com/hyphaldao">
							<TwitterIcon fill="white" />
						</a>
						<a target="_blank" rel="noopener noreferrer" href="https://discord.gg/zC5CuFJwqu">
							<DiscordIcon fill="white" />
						</a>
					</div>
				</div>
				<div className="footer__col">
					<h3>Resources</h3>
					<a>Learn</a>
					<a>FAQ</a>
					<a>Guidelines</a>
					<a>Report Content</a>
				</div>
				<div className="footer__col">
					<h3>Company</h3>
					<a>Contact</a>
					<a>Terms of Service</a>
					<a>Privacy Policy</a>
				</div>
			</div>
		</footer>
	)
}

export default Footer
