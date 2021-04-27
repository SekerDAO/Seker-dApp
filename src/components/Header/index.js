import React from 'react'
import { connect } from 'react-redux'
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
								<span onClick={() => auth.signOut()}>
									LogOut
								</span>
							</li>
						</ul>

					]}
					{!currentUser && [
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
								<Link to="/login">
									Connect Wallet
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

const mapStateToProps = ({ user }) => ({
	currentUser: user.currentUser
})

export default connect(mapStateToProps, null) (Header);