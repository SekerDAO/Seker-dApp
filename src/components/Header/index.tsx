import React, {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import "./styles.scss"
import {useAuth} from "../../customHooks/useAuth"

const Header: FunctionComponent = () => {
	const {account, connectWallet, isLoggedIn, signIn, signOut, chainId} = useAuth()

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
						{account && (
							<li>
								<span>{account}</span>
							</li>
						)}
						{chainId && (
							<li>
								<span>Chain ID: {chainId}</span>
							</li>
						)}
						<li>
							{account ? (
								isLoggedIn ? (
									<span onClick={signOut}>Logout</span>
								) : (
									<span onClick={signIn}>Sign In</span>
								)
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
