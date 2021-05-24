import React, {FunctionComponent, useContext} from "react"
import {useHistory, useLocation, useParams} from "react-router-dom"
import "./styles.scss"
import {AuthContext} from "../../customHooks/useAuth"
import {parse} from "query-string"
import ProfileGallery from "../../components/UserProfile/ProfileGallery"
import Button from "../../components/Controls/Button"
import ProfileEdit from "../../components/UserProfile/ProfileEdit"
import ProfileDAOs from "../../components/UserProfile/ProfileDAOs"
import ProfileView from "../../components/UserProfile/ProfileView"
import CreateCustomDomainModal from "../../components/CreateCustomDomainModal"

type ProfilePage = "nfts" | "edit" | "daos" | "profile"

const Profile: FunctionComponent = () => {
	const {connected, account: userAccount} = useContext(AuthContext)
	const {push} = useHistory()
	const {pathname, search} = useLocation()
	const {account} = useParams<{account: string}>()
	const isOwner = connected && account.toUpperCase() === userAccount?.toUpperCase()
	const page: ProfilePage = (isOwner && (parse(search).page as ProfilePage)) || "nfts"

	return (
		<div className="profile">
			<div className="profile__photo" />
			<div className="profile__info">
				<h2>TODO: name</h2>
				<p>{`${account.slice(0, 3)}...${account.slice(-4)}`}</p>
				<p>TODO: description</p>
				{isOwner && (
					<div className="profile__edit-menu">
						<a
							className={page === "nfts" ? "active" : undefined}
							onClick={() => {
								push(pathname)
							}}
						>
							Create / Edit NFTs
						</a>
						<a
							className={page === "edit" ? "active" : undefined}
							onClick={() => {
								push(`${pathname}?page=edit`)
							}}
						>
							Edit Profile
						</a>
						<a
							className={page === "daos" ? "active" : undefined}
							onClick={() => {
								push(`${pathname}?page=daos`)
							}}
						>
							View Youe DAOs
						</a>
						<a
							className={page === "profile" ? "active" : undefined}
							onClick={() => {
								push(`${pathname}?page=profile`)
							}}
						>
							View Profile
						</a>
					</div>
				)}
			</div>
			<div className="profile__main">
				{page === "nfts" && (
					<>
						{isOwner && (
							<div className="profile__edit-buttons">
								<CreateCustomDomainModal />
								<Button buttonType="secondary">Create / Load NFT</Button>
							</div>
						)}
						<ProfileGallery account={account} />
					</>
				)}
				{page === "edit" && <ProfileEdit />}
				{page === "daos" && <ProfileDAOs />}
				{page === "profile" && <ProfileView />}
			</div>
		</div>
	)
}

export default Profile
