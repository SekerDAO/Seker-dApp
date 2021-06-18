import React, {FunctionComponent, useContext} from "react"
import {useHistory, useLocation, useParams} from "react-router-dom"
import "./styles.scss"
import {AuthContext} from "../../context/AuthContext"
import {parse} from "query-string"
import ProfileGallery from "../../components/UserProfile/ProfileGallery"
import ProfileEdit from "../../components/UserProfile/ProfileEdit"
import ProfileDAOs from "../../components/UserProfile/ProfileDAOs"
import ProfileView from "../../components/UserProfile/ProfileView"
import CreateCustomDomainModal from "../../components/UserProfile/CreateCustomDomainModal"
import CreateNFTModal from "../../components/UserProfile/CreateNFTModal"
import useUser from "../../customHooks/getters/useUser"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import Loader from "../../components/Loader"

type ProfilePage = "nfts" | "edit" | "daos" | "profile"

const Profile: FunctionComponent = () => {
	const {connected, account: userAccount} = useContext(AuthContext)
	const {push} = useHistory()
	const {pathname, search} = useLocation()
	const {account} = useParams<{account: string}>()
	const {user, loading, error} = useUser(account)
	const isOwner = connected && account === userAccount
	const page: ProfilePage = (isOwner && (parse(search).page as ProfilePage)) || "nfts"

	if (error) return <ErrorPlaceholder />
	if (loading || !user) return <Loader />

	return (
		<div className="profile">
			<div className="profile__photo" style={{backgroundImage: `url("/assets/PersonalDashboard_Photo.png")`}} />
			<div className="profile__info">
				<h2>{user.name}</h2>
				<p>{`${account.slice(0, 3)}...${account.slice(-4)}`}</p>
				<p>{user.bio}</p>
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
							View Your DAOs
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
								<CreateNFTModal />
							</div>
						)}
						<ProfileGallery account={account} />
					</>
				)}
				{page === "edit" && <ProfileEdit user={user} />}
				{page === "daos" && <ProfileDAOs />}
				{page === "profile" && <ProfileView />}
			</div>
		</div>
	)
}

export default Profile
