import {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import {ReactComponent as Logo} from "../../assets/icons/logo-white.svg"
import {ReactComponent as DiscordGrayscale} from "../../assets/icons/discord-grayscale.svg"
import {ReactComponent as TwitterGrayscale} from "../../assets/icons/twitter-grayscale.svg"
import "./styles.scss"

const Footer: FunctionComponent = () => {
	return (
		<footer className="footer">
			<div className="footer__wrap">
				<div className="footer__col">
					<Link to="/">
						<Logo width="80px" height="80px" />
					</Link>
					© Hyphal 2021
					<div className="footer__socials">
						<a target="_blank" rel="noopener noreferrer" href="https://twitter.com/hyphaldao">
							<TwitterGrayscale width="24px" height="20px" />
						</a>
						<a target="_blank" rel="noopener noreferrer" href="https://discord.gg/zC5CuFJwqu">
							<DiscordGrayscale width="24px" height="20px" />
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
