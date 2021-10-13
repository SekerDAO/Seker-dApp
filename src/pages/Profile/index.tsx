import React, {FunctionComponent, useContext, useEffect, useState} from "react"
import {useHistory, useLocation, useParams} from "react-router-dom"
import "./styles.scss"
import {AuthContext} from "../../context/AuthContext"
import {parse} from "query-string"
import NFTGallery from "../../components/NFTGallery"
import ProfileEdit from "../../components/User/ProfileEdit"
import ProfileDAOs from "../../components/User/ProfileDAOs"
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
import {isAddress} from "@ethersproject/address"

type ProfilePage = "nfts" | "edit" | "daos" | "profile"

const Profile: FunctionComponent = () => {
	const {connected, account: userAccount} = useContext(AuthContext)
	const {push, replace} = useHistory()
	const {pathname, search} = useLocation()
	const [galleryKey, setGalleryKey] = useState(Math.random())

	const {userId} = useParams<{userId: string}>()
	const {user, loading, error, refetch} = useUser(userId)
	useEffect(() => {
		if (user && user.url && isAddress(userId)) {
			replace(`/profile/${user.url}`)
		}
	}, [user])

	const isOwner = connected && user?.account === userAccount
	const page: ProfilePage = (isOwner && (parse(search).page as ProfilePage)) || "nfts"

	if (error) return <ErrorPlaceholder />
	if (loading || !user) return <Loader />

	const updateGallery = () => {
		setGalleryKey(Math.random())
	}

	const handleUploadProfileImage = async (file: File) => {
		if (!user.account) return
		await updateUserImage(file, user.account, "profile")
		refetch()
	}

	const handleUploadHeaderImage = async (file: File) => {
		if (!user.account) return
		await updateUserImage(file, user.account, "header")
		refetch()
	}

	return (
		<>
			<DashboardHeader background={user.headerImage}>
				{isOwner && page === "edit" && (
					<UploadImageModal
						titleText="Edit Header Image"
						buttonName="Edit Header"
						onUpload={handleUploadHeaderImage}
						initialUrl={user.headerImage}
						successToastText="Header image successfully updated!"
						errorToastText="Failed to update header image"
					/>
				)}
			</DashboardHeader>
			<div className="main__container">
				<div className="profile">
					<div
						className="profile__photo"
						style={
							user.profileImage
								? {
										backgroundImage: `url("${user.profileImage}")`
								  }
								: {}
						}
					>
						{isOwner && page === "edit" && (
							<UploadImageModal
								titleText="Edit Profile Image"
								buttonName="Edit Image"
								onUpload={handleUploadProfileImage}
								initialUrl={user.profileImage}
								successToastText="Image successfully updated!"
								errorToastText="Failed to update image"
							/>
						)}
					</div>
					<div className="profile__info">
						<h2>{user.name || "Unnamed user"}</h2>
						<p>{`${user.account.slice(0, 3)}...${user.account.slice(-4)}`}</p>
						<p>{user.location}</p>
						<a target="_blank" rel="noopener noreferrer" href={`mailto:${user.email}`}>
							{user.email}
						</a>
						{user.website && (
							<a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer">
								{user.website}
							</a>
						)}
						<p>{user.bio}</p>
						<div className="profile__socials">
							{user.twitter && (
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={`https://twitter.com/${user.twitter}`}
								>
									<TwitterIcon fill={PURPLE_2} />
								</a>
							)}
							{user.instagram && (
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={`https://instagram.com/${user.twitter}`}
								>
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
						{page === "nfts" && isOwner && userAccount && (
							<div className="profile__edit-buttons">
								<CreateCustomDomainModal afterCreate={refetch} />
								<CreateNFTModal afterCreate={updateGallery} account={userAccount} />
							</div>
						)}
						{["nfts", "profile"].includes(page) && (
							<NFTGallery
								key={galleryKey}
								account={user.account}
								canDelete={isOwner && page === "nfts"}
							/>
						)}
						{page === "edit" && (
							<ProfileEdit
								user={user}
								afterSubmit={() => {
									refetch()
									push(pathname)
								}}
								onCancel={() => {
									push(pathname)
								}}
							/>
						)}
						{page === "daos" && <ProfileDAOs />}
					</div>
				</div>
			</div>
		</>
	)
}

export default Profile
