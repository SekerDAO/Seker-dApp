import React, {FunctionComponent, useRef, useState} from "react"
import {Link} from "react-router-dom"
import {useAuth} from "../../customHooks/useAuth"
import useClickOutside from "../../customHooks/useClickOutside"

const HeaderMenu: FunctionComponent = () => {
	const {account, connected, connecting, connectWallet, disconnect} = useAuth()
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
								<Link to={`/profile/${account}`}>Profile</Link>
							</li>
						)}
						<li>
							<Link to="/learn">Learn</Link>
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
