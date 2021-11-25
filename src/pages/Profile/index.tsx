import {FunctionComponent, useContext, useEffect, useState} from "react"
import {useHistory, useLocation, useParams} from "react-router-dom"
import "./styles.scss"
import {AuthContext} from "../../context/AuthContext"
import {parse} from "query-string"
import NFTGallery from "../../components/NFTGallery"
import ProfileEdit from "../../components/User/ProfileEdit"
import ProfileDAOs from "../../components/User/ProfileDAOs"
import CreateCustomDomainModal from "../../components/Modals/CreateCustomDomainModal"
import CreateNFTModal from "../../components/Modals/CreateNFTModal"
import useUser from "../../hooks/getters/useUser"
import ErrorPlaceholder from "../../components/UI/ErrorPlaceholder"
import Loader from "../../components/UI/Loader"
import updateUserImage from "../../api/firebase/user/updateUserImage"
import UploadImageModal from "../../components/Modals/UploadImageModal"
import {ReactComponent as TwitterIcon} from "../../assets/icons/twitter.svg"
import {ReactComponent as InstagramIcon} from "../../assets/icons/instagram.svg"
import DashboardHeader from "../../components/UI/DashboardHeader"
import {isAddress} from "@ethersproject/address"
import DashboardMenu from "../../components/UI/DashboardMenu"
import {formatReadableAddress} from "../../utlls"

type ProfilePage = "nfts" | "edit" | "daos" | "profile"

const Profile: FunctionComponent = () => {
	const {connected, account: userAccount} = useContext(AuthContext)
	const {push, replace} = useHistory()
	const {pathname, search} = useLocation()
	const [galleryKey, setGalleryKey] = useState(Math.random())

	const {userId} = useParams<{userId: string}>()
	const {user, error, refetch} = useUser(userId)
	useEffect(() => {
		if (user && user.url && isAddress(userId)) {
			replace(`/profile/${user.url}`)
		}
	}, [replace, user, userId])

	const isOwner = connected && user?.account === userAccount
	const page: ProfilePage = (isOwner && (parse(search).page as ProfilePage)) || "nfts"

	if (error) return <ErrorPlaceholder />
	if (!user) return <Loader />

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
						<p>{formatReadableAddress(user.account)}</p>
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
									<TwitterIcon width="24px" height="20px" />
								</a>
							)}
							{user.instagram && (
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={`https://instagram.com/${user.twitter}`}
								>
									<InstagramIcon width="24px" height="20px" />
								</a>
							)}
						</div>
						{isOwner && (
							<DashboardMenu
								currentPage={page}
								items={[
									{
										title: "Create / Edit NFTs",
										to: pathname,
										page: "nfts"
									},
									{
										title: "Edit Profile",
										to: `${pathname}?page=edit`,
										page: "edit"
									},
									{
										title: "View Your DAOs",
										to: `${pathname}?page=daos`,
										page: "daos"
									},
									{
										title: "View Profile",
										to: `${pathname}?page=profile`,
										page: "profile"
									}
								]}
							/>
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
