import React from 'react'
import './styles.scss'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import { auth } from './../../firebase/utils'

const Header = props => {
	const { currentUser } = props

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
					{currentUser && [
						<ul>
							<li>
								<span onClick={() => auth.signOut()}>
									<h4>LogOut</h4>
								</span>
							</li>
						</ul>

					]}
					{!currentUser && [
						<ul>
							<li>
								<Link to="/learn">
									<h4> Learn </h4>
								</Link>
							</li>
							<li>
								<Link to="/registration">
								  <h4>Register</h4>
								</Link>
							</li>
							<li>
								<Link to="/login">
									<h4> Connect Wallet </h4>
								</Link>
							</li>
						</ul>
					]}

				</div>
			</div>
		</header>
	)
}

Header.defaultProp = {
	currentUser: null
}

export default Header;