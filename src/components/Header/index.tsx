import React, {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import "./styles.scss"
import {useAuth} from "../../customHooks/useAuth"

const Header: FunctionComponent = () => {
	const {account, connected, connecting, connectWallet, disconnect} = useAuth()

	return (
		<header className="header">
			<div className="wrap">
				<div className="logo">
					<Link to="/">
						<img src="/assets/logo.png" alt="Sample logo" />
					</Link>
				</div>
				<div className="name">
					<h3>TokenWalk</h3>
				</div>
				<div className="navigation">
					<ul>
						<li>
							<Link to="/learn">Learn</Link>
						</li>
						<li>
							<Link to="/dashboard">My Account</Link>
						</li>
						<li>
							<Link to="/galleries">Galleries</Link>
						</li>
						<li>
							<Link to="/galleries">Exhibits</Link>
						</li>
						<li>
							{account && connected ? (
								<span>
									{account} <span onClick={disconnect}>Disconnect</span>
								</span>
							) : connecting ? (
								<span>Connecting...</span>
							) : (
								<span onClick={connectWallet}>Connect Wallet</span>
							)}
						</li>
					</ul>
				</div>
			</div>
		</header>
	)
}

export default Header
