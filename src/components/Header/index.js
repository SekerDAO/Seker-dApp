import React from 'react'
import './styles.scss'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'

const Header = props => {
	return (
		<header className="header">
			<div className="wrap">
				<div className="logo">
					<Link to="/">
						<img src={logo} alt="Sample logo" />
					</Link>
				</div>
				<div className="name">
					<h3>TOKEN WALK</h3>
				</div>
				<div className="navigation">
					<ul>
						<li>
							<Link to="/learn">
								Learn
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</header>
	)
}

export default Header;