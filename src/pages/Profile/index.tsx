import React, {FunctionComponent, useContext} from "react"
import {useHistory, useLocation, useParams} from "react-router-dom"
import "./styles.scss"
import {AuthContext} from "../../context/AuthContext"
import {parse} from "query-string"
import NFTGallery from "../../components/NFTGallery"
import ProfileEdit from "../../components/User/ProfileEdit"
import ProfileDAOs from "../../components/User/ProfileDAOs"
import ProfileView from "../../components/User/ProfileView"
import CreateCustomDomainModal from "../../components/Modals/CreateCustomDomainModal"
import CreateNFTModal from "../../components/Modals/CreateNFTModal"
import useUser from "../../customHooks/getters/useUser"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import Loader from "../../components/Loader"
import updateUserImage from "../../api/firebase/user/updateUserImage"
import UploadImageModal from "../../components/Modals/UploadImageModal"
import TwitterIcon from "../../icons/TwitterIcon"
import InstagramIcon from "../../icons/InstagramIcon"
import {PURPLE_2} from "../../constants/colors"
import DashboardHeader from "../../components/DashboardHeader"

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

	const handleUploadImage = async (file: File) => {
		if (!account) return
		await updateUserImage(file, account)
	}

	return (
		<>
			<DashboardHeader />
			<div className="main__container">
				<div className="profile">
					<div
						className="profile__photo"
						style={{backgroundImage: `url("${user.image ?? "/assets/PersonalDashboard_Photo.png"}")`}}
					>
						{isOwner && (
							<UploadImageModal
								titleText="Edit Profile Image"
								buttonName="Edit Image"
								onUpload={handleUploadImage}
								initialUrl={user.image}
								successToastText="Image successfully updated!"
								errorToastText="Failed to update image"
							/>
						)}
					</div>
					<div className="profile__info">
						<h2>{user.name}</h2>
						<p>{`${account.slice(0, 3)}...${account.slice(-4)}`}</p>
						<p>{user.bio}</p>
						<p>{user.email}</p>
						{user.website && (
							<a href={user.website.startsWith("http") ? user.website : `https://${user.website}`}>{user.website}</a>
						)}
						<p>{user.location}</p>
						<div className="profile__socials">
							{user.twitter && (
								<a target="_blank" rel="noopener noreferrer" href={`https://twiter.com/${user.twitter}`}>
									<TwitterIcon fill={PURPLE_2} />
								</a>
							)}
							{user.instagram && (
								<a target="_blank" rel="noopener noreferrer" href={`https://instagram.com/${user.twitter}`}>
									<InstagramIcon fill={PURPLE_2} />
								</a>
							)}
						</div>
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
								<NFTGallery account={account} />
							</>
						)}
						{page === "edit" && <ProfileEdit user={user} />}
						{page === "daos" && <ProfileDAOs />}
						{page === "profile" && <ProfileView />}
					</div>
				</div>
			</div>
		</>
	)
}

export default Profile
