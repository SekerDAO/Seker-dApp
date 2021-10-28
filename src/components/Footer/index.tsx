import React, {FunctionComponent, useContext} from "react"
import {Link} from "react-router-dom"
import {ModalContext} from "../../context/ModalContext"
import DiscordIcon from "../../icons/DiscordIcon"
import Logo from "../../icons/Logo"
import TwitterIcon from "../../icons/TwitterIcon"
import CreateNFTModal from "../Modals/CreateNFTModal"
import "./styles.scss"

const Footer: FunctionComponent = () => {
	const {setOverlay} = useContext(ModalContext)

	return (
		<footer className="footer">
			<div className="footer__wrap">
				<div className="footer__col">
					<Link to="/">
						<Logo />
					</Link>
					© TokenWalk 2021
					<div className="footer__socials">
						<a target="_blank" rel="noopener noreferrer" href="https://twitter.com/tokenwalk">
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
					<button onClick={() => setOverlay({key: "Open Modal", component: <CreateNFTModal />})}>
						learn
					</button>
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
