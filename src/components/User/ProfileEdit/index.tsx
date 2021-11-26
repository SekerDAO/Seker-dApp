import checkUserUrl from "../../../api/firebase/user/checkUserUrl"
import editUser from "../../../api/firebase/user/editUser"
import {AuthContext} from "../../../context/AuthContext"
import useValidation from "../../../hooks/useValidation"
import {User} from "../../../types/user"
import Button from "../../Controls/Button"
import Input from "../../Controls/Input"
import {toastError, toastSuccess} from "../../UI/Toast"
import "./styles.scss"
import {FunctionComponent, useContext, useState} from "react"

const ProfileEdit: FunctionComponent<{
	user: Omit<User, "myDaos" | "myDomains">
	afterSubmit: () => void
	onCancel: () => void
}> = ({user, afterSubmit, onCancel}) => {
	const [name, setName] = useState(user.name ?? "")
	const [url, setUrl] = useState(user.url ?? "")
	const [bio, setBio] = useState(user.bio ?? "")
	const [location, setLocation] = useState(user.location ?? "")
	const [email, setEmail] = useState(user.email ?? "")
	const [website, setWebsite] = useState(user.website ?? "")
	const [twitter, setTwitter] = useState(user.twitter ?? "")
	const [instagram, setInstagram] = useState(user.instagram ?? "")
	const [processing, setProcessing] = useState(false)
	const {account} = useContext(AuthContext)

	const validateUrl = async (val: string) => {
		if (!account) {
			throw new Error("Account not connected")
		}
		const res = await checkUserUrl(val, account)
		return res ? null : "This URL is occupied"
	}
	const {validation: urlValidation} = useValidation(url, [validateUrl])

	const handleSubmit = async () => {
		if (urlValidation) return
		setProcessing(true)
		try {
			await editUser({
				name,
				url,
				bio,
				location,
				email,
				website,
				twitter,
				instagram
			})
			afterSubmit()
			toastSuccess("Profile successfully edited!")
		} catch (e) {
			console.error(e)
			toastError("Failed to edit profile")
		}
		setProcessing(false)
	}

	return (
		<div className="profile-edit">
			<label htmlFor="profile-edit-name">Display Name</label>
			<Input
				id="profile-edit-name"
				value={name}
				onChange={e => {
					setName(e.target.value)
				}}
			/>
			<label htmlFor="profile-edit-url">Custom URL</label>
			<Input
				validation={urlValidation}
				staticPlaceholder="hyphal.hyz/"
				id="profile-edit-url"
				value={url}
				onChange={e => {
					setUrl(e.target.value)
				}}
			/>
			<label htmlFor="profile-edit-bio">Biography</label>
			<Input
				id="profile-edit-bio"
				maxLength={280}
				value={bio}
				onChange={e => {
					setBio(e.target.value)
				}}
			/>
			<label htmlFor="profile-edit-loc">Location</label>
			<Input
				id="profile-edit-loc"
				value={location}
				onChange={e => {
					setLocation(e.target.value)
				}}
			/>
			<label htmlFor="profile-edit-email">Email</label>
			<Input
				id="profile-edit-email"
				value={email}
				onChange={e => {
					setEmail(e.target.value)
				}}
			/>
			<label htmlFor="profile-edit-site">Website</label>
			<Input
				staticPlaceholder="https://"
				id="profile-edit-site"
				value={website}
				onChange={e => {
					setWebsite(e.target.value)
				}}
			/>
			<div className="profile-edit__socials">
				<div className="profile-edit__social">
					<label htmlFor="profile-edit-tw">Twitter URL</label>
					<Input
						staticPlaceholder="twitter.com/"
						id="profile-edit-tw"
						value={twitter}
						onChange={e => {
							setTwitter(e.target.value)
						}}
					/>
				</div>
				<div className="profile-edit__social">
					<label htmlFor="profile-edit-inst">Instagram URL</label>
					<Input
						staticPlaceholder="instagram.com/"
						id="profile-edit-inst"
						value={instagram}
						onChange={e => {
							setInstagram(e.target.value)
						}}
					/>
				</div>
			</div>
			<div className="profile-edit__buttons">
				<Button
					buttonType="primary"
					onClick={handleSubmit}
					disabled={processing || !!urlValidation}
				>
					{processing ? "Saving..." : "Save Changes"}
				</Button>
				<Button buttonType="link" onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</div>
	)
}

export default ProfileEdit
