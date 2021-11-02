import {FunctionComponent, useContext, useState} from "react"
import {Link} from "react-router-dom"
import {AuthContext} from "../../context/AuthContext"
import Dropdown from "../Controls/Dropdown"
import Button from "../Controls/Button"
import Divider from "../UI/Divider"
import CreateGnosisSafeModal from "../Modals/CreateGnosisSafeModal"

const HeaderMenu: FunctionComponent = () => {
	const {account, url, connected, connecting, connectWallet, disconnect} = useContext(AuthContext)
	const [isOpened, setIsOpened] = useState(false)

	const handleDropdownTriggerClick = () => {
		setIsOpened(prevState => !prevState)
	}

	const closeMenu = () => {
		setIsOpened(false)
	}

	const handleItemClick = (itemId: string) => {
		if (itemId === "disconnect") {
			disconnect()
		}
	}

	return (
		<div className="header__main-nav">
			<ul className="header__menu">
				<li>
					<CreateGnosisSafeModal afterCreate={() => undefined} />
					{/* <Link to="/daos">DAOs</Link> */}
				</li>
				<li>
					<Link to="/events">Events</Link>
				</li>
				<li>
					<Link to="/learn">Learn</Link>
				</li>
			</ul>
			<Divider type="vertical" />
			{account && connected ? (
				<Dropdown<string>
					isOpened={isOpened}
					triggerText="Profile"
					onClose={closeMenu}
					onItemClick={handleItemClick}
					onTriggerClick={handleDropdownTriggerClick}
					items={[
						{
							value: "profile",
							name: (
								<Link to={`/profile/${url ?? account}`}>{`${account.slice(0, 6)}...${account.slice(
									-4
								)}`}</Link>
							)
						},
						{
							value: "disconnect",
							name: "Disconnect"
						}
					]}
					borders="none"
				/>
			) : (
				<Button
					onClick={connectWallet}
					buttonType="link"
					disabled={connecting}
					extraClassName="header__connect-button"
				>
					{connecting ? "Connecting" : "Connect Wallet"}
				</Button>
			)}
		</div>
	)
}

export default HeaderMenu
