import React, {FunctionComponent} from "react"
import "./styles.scss"
import Logo from "../../icons/Logo"
import {Link} from "react-router-dom"
import TwitterIcon from "../../icons/TwitterIcon"
import DiscordIcon from "../../icons/DiscordIcon"

const Footer: FunctionComponent = () => {
	return (
		<footer className="footer">
			<div className="footer__wrap">
				<div className="footer__col">
					<Link to="/">
						<Logo />
					</Link>
					© TokenWalk 2021
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
					<div className="footer__socials">
						<a target="_blank" rel="noopener noreferrer" href="https://twitter.com/tokenwalk">
							<TwitterIcon fill="white" />
						</a>
						<a target="_blank" rel="noopener noreferrer" href="https://discord.gg/f2S3PZZc">
							<DiscordIcon fill="white" />
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
