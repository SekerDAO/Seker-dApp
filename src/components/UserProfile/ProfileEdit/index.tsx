import React, {FunctionComponent, useState} from "react"
import "./styles.scss"
import Input from "../../Controls/Input"
import Button from "../../Controls/Button"

const ProfileEdit: FunctionComponent = () => {
	const [name, setName] = useState("")
	const [url, setUrl] = useState("")
	const [bio, setBio] = useState("")
	const [location, setLocation] = useState("")
	const [email, setEmail] = useState("")
	const [website, setWebsite] = useState("")
	const [twitter, setTwitter] = useState("")
	const [instagram, setInstagram] = useState("")

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
			<Button buttonType="primary">Save</Button>
		</div>
	)
}

export default ProfileEdit
