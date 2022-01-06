import {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import {ReactComponent as DiscordGrayscale} from "../../assets/icons/discord-grayscale.svg"
import {ReactComponent as GitHubGrayscale} from "../../assets/icons/github-grayscale.svg"
import {ReactComponent as Logo} from "../../assets/icons/logo-white.svg"
import {ReactComponent as MediumGrayscale} from "../../assets/icons/medium-grayscale.svg"
import {ReactComponent as TelegramGrayscale} from "../../assets/icons/telegram-grayscale.svg"
import {ReactComponent as TwitterGrayscale} from "../../assets/icons/twitter-grayscale.svg"
import Divider from "../UI/Divider"
import "./styles.scss"

const Footer: FunctionComponent = () => (
	<footer className="footer">
		<div className="footer__wrap">
			<div className="footer__col">
				<Link to="/">
					<Logo width="80px" height="80px" />
				</Link>
			</div>
			<div className="footer__col">
				<h3 className="footer__text--dark">Projects</h3>
				<a>SekerDAO</a>
				<a>Seker Galleries</a>
				<a>Zodiac(Gnosis)</a>
			</div>
			<div className="footer__col">
				<h3 className="footer__text--dark">Support</h3>
				<a>Guidlines</a>
				<a>Contact Us</a>
				<a>Report Content</a>
			</div>
		</div>
		<Divider />
		<div className="footer__wrap">
			<div className="footer__col">
				<span className="footer__text--dark">© Seker 2021</span>
			</div>
			<div className="footer__col">
				<div className="footer__socials">
					<a target="_blank" rel="noopener noreferrer" href="https://twitter.com/sekerdao">
						<TwitterGrayscale width="24px" height="20px" />
					</a>
					<a target="_blank" rel="noopener noreferrer" href="https://discord.gg/zC5CuFJwqu">
						<DiscordGrayscale width="24px" height="20px" />
					</a>
					{/* TODO: Add link for Telegram once we will set it up. Keep icon for now to match the design */}
					<a target="_blank" rel="noopener noreferrer">
						<TelegramGrayscale width="24px" height="20px" />
					</a>
					<a target="_blank" rel="noopener noreferrer" href="https://github.com/SekerDAO">
						<GitHubGrayscale width="24px" height="20px" />
					</a>
					<a target="_blank" rel="noopener noreferrer" href="https://sekerdao.medium.com/">
						<MediumGrayscale width="24px" height="20px" />
					</a>
				</div>
			</div>
		</div>
	</footer>
)

export default Footer
