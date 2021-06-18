import React, {FunctionComponent, useContext, useState} from "react"
import "./styles.scss"
import Input from "../../Controls/Input"
import Button from "../../Controls/Button"
import {AuthContext} from "../../../context/AuthContext"
import editUser from "../../../api/firebase/user/editUser"
import {toastError, toastSuccess} from "../../Toast"
import {User} from "../../../types/user"

const ProfileEdit: FunctionComponent<{user: User}> = ({user}) => {
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

	const handleSubmit = async () => {
		if (!account) return
		setProcessing(true)
		try {
			await editUser(
				{
					name,
					url,
					bio,
					location,
					email,
					website,
					twitter,
					instagram
				},
				account
			)
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
				borders="all"
				value={name}
				onChange={e => {
					setName(e.target.value)
				}}
			/>
			<label htmlFor="profile-edit-url">Custom URL</label>
			<div className="profile-edit__url-container">
				<div className="profile-edit__url-placeholder">tokenwalk.com</div>
				<Input
					id="profile-edit-url"
					borders="all"
					value={url}
					onChange={e => {
						setUrl(e.target.value)
					}}
				/>
			</div>
			<label htmlFor="profile-edit-bio">Biography</label>
			<Input
				id="profile-edit-bio"
				borders="all"
				value={bio}
				onChange={e => {
					setBio(e.target.value)
				}}
			/>
			<label htmlFor="profile-edit-loc">Location</label>
			<Input
				id="profile-edit-loc"
				borders="all"
				value={location}
				onChange={e => {
					setLocation(e.target.value)
				}}
			/>
			<label htmlFor="profile-edit-email">Email</label>
			<Input
				id="profile-edit-email"
				borders="all"
				value={email}
				onChange={e => {
					setEmail(e.target.value)
				}}
			/>
			<label htmlFor="profile-edit-site">Website</label>
			<Input
				id="profile-edit-site"
				borders="all"
				value={website}
				onChange={e => {
					setWebsite(e.target.value)
				}}
			/>
			<div className="profile-edit__socials">
				<div className="profile-edit__social">
					<label htmlFor="profile-edit-tw">Twitter URL</label>
					<Input
						id="profile-edit-tw"
						borders="all"
						value={twitter}
						onChange={e => {
							setTwitter(e.target.value)
						}}
					/>
				</div>
				<div className="profile-edit__social">
					<label htmlFor="profile-edit-inst">Instagram URL</label>
					<Input
						id="profile-edit-inst"
						borders="all"
						value={instagram}
						onChange={e => {
							setInstagram(e.target.value)
						}}
					/>
				</div>
			</div>
			<Button buttonType="primary" onClick={handleSubmit} disabled={processing}>
				{processing ? "Saving..." : "Save"}
			</Button>
		</div>
	)
}

export default ProfileEdit
