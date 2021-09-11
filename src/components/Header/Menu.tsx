import React, {FunctionComponent, useContext, useRef, useState} from "react"
import {Link} from "react-router-dom"
import {AuthContext} from "../../context/AuthContext"
import useClickOutside from "../../customHooks/useClickOutside"

const HeaderMenu: FunctionComponent = () => {
	const {account, url, connected, connecting, connectWallet, disconnect} = useContext(AuthContext)
	const [isOpened, setIsOpened] = useState(false)
	const ref = useRef<HTMLDivElement | null>(null)

	const openMenu = () => {
		setIsOpened(true)
	}

	const closeMenu = () => {
		setIsOpened(false)
	}
	useClickOutside(ref, closeMenu)

	return (
		<div className="header__menu" ref={ref}>
			<div className="header__menu-button" onClick={openMenu}>
				<div />
				<div />
				<div />
			</div>
			{isOpened && (
				<div className="header__menu-dropdown">
					<ul>
						{account && connected && (
							<li>
								<Link to={`/profile/${url ?? account}`}>Profile</Link>
							</li>
						)}
						<li>
							<Link to="/learn">Learn</Link>
						</li>
						<li>
							<Link to="/daos">DAOs</Link>
						</li>
						<li>
							{account && connected ? (
								<span>
									{`${account.slice(0, 3)}...${account.slice(-4)} `}
									<span onClick={disconnect}>Disconnect</span>
								</span>
							) : connecting ? (
								<span>Connecting...</span>
							) : (
								<span onClick={connectWallet}>Connect Wallet</span>
							)}
						</li>
					</ul>
				</div>
			)}
		</div>
	)
}

export default HeaderMenu
