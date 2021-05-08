import React from 'react'
import './styles.scss'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'

const Header = () => {
	const currentUser  = null // TODO

	const signOut = () => {
		// dispatch(signOutUserStart())
	}

	return (
		<header className="header">
			<div className="wrap">
				<div className="logo">
					<Link to="/">
						<img src={logo} alt="Sample logo" />
					</Link>
				</div>
				<div className="name">
					<h3>TokenWalk</h3>
				</div>
				<div className="navigation">
					{currentUser ? <>
						<ul>
							<li>
								<Link to="/learn">
									Learn
								</Link>
							</li>
							<li>
								<Link to="/dashboard">
									My Account
								</Link>
							</li>
							<li>
								<Link to="/galleries">
								    Galleries
								</Link>
							</li>
							<li>
								<Link to="/galleries">
								    Exhibits
								</Link>
							</li>
							<li>
								<span onClick={() => signOut()}>
									LogOut
								</span>
							</li>
						</ul>
						</> : <>
						<ul>
							<li>
								<Link to="/learn">
									Learn
								</Link>
							</li>
							<li>
								<Link to="/registration">
								    Register
								</Link>
							</li>
							<li>
								<Link to="/galleries">
								    Galleries
								</Link>
							</li>
							<li>
								<Link to="/galleries">
								    Exhibits
								</Link>
							</li>
							<li>
								<Link to="/login">
									Connect Wallet
								</Link>
							</li>
						</ul>
					</>}

				</div>
			</div>
		</header>
	)
}

Header.defaultProp = {
	currentUser: null
}

export default Header
