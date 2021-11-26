import {FunctionComponent, useState} from "react"
import editDAO from "../../../api/firebase/DAO/editDAO"
import {DAOFirebaseData} from "../../../types/DAO"
import Button from "../../Controls/Button"
import Input from "../../Controls/Input"
import {toastError, toastSuccess} from "../../UI/Toast"
import "./styles.scss"

const EditDAO: FunctionComponent<{
	dao: DAOFirebaseData
	afterEdit: () => void
	onClose: () => void
}> = ({dao, afterEdit, onClose}) => {
	const [processing, setProcessing] = useState(false)
	const [name, setName] = useState(dao.name)
	const [description, setDescription] = useState(dao.description ?? "")
	const [website, setWebsite] = useState(dao.website ?? "")
	const [twitter, setTwitter] = useState(dao.twitter ?? "")
	const [telegram, setTelegram] = useState(dao.telegram ?? "")
	const [discord, setDiscord] = useState(dao.discord ?? "")

	const handleSave = async () => {
		if (!name) return
		setProcessing(true)
		try {
			await editDAO({
				gnosisAddress: dao.gnosisAddress,
				name,
				description,
				website,
				twitter,
				telegram,
				discord
			})
			toastSuccess("DAO Successfully edited")
			afterEdit()
			onClose()
		} catch (e) {
			console.error(e)
			toastError("Failed to update DAO")
		}
		setProcessing(false)
	}

	return (
		<div className="edit-dao">
			<div className="edit-dao__row">
				<label htmlFor="edit-dao-name">Display Name</label>
				<Input
					value={name}
					onChange={e => {
						setName(e.target.value)
					}}
					id="edit-dao-name"
				/>
			</div>
			<div className="edit-dao__row">
				<label htmlFor="edit-dao-desc">About</label>
				<Input
					value={description}
					onChange={e => {
						setDescription(e.target.value)
					}}
					id="edit-dao-desc"
				/>
			</div>
			<div className="edit-dao__row">
				<div className="edit-dao__half-row">
					<label htmlFor="edit-dao-website">Website</label>
					<Input
						staticPlaceholder="https://"
						value={website}
						onChange={e => {
							setWebsite(e.target.value)
						}}
						id="edit-dao-website"
					/>
				</div>
				<div className="edit-dao__half-row">
					<label htmlFor="edit-dao-tw">Twitter URL</label>
					<Input
						staticPlaceholder="twitter.com/"
						value={twitter}
						onChange={e => {
							setTwitter(e.target.value)
						}}
						id="edit-dao-tw"
					/>
				</div>
			</div>
			<div className="edit-dao__row">
				<div className="edit-dao__half-row">
					<label htmlFor="edit-dao-tg">Telegram URL</label>
					<Input
						staticPlaceholder="t.me/"
						value={telegram}
						onChange={e => {
							setTelegram(e.target.value)
						}}
						id="edit-dao-tg"
					/>
				</div>
				<div className="edit-dao__half-row">
					<label htmlFor="edit-dao-discord">Discord URL</label>
					<Input
						staticPlaceholder="discord.gg/"
						value={discord}
						onChange={e => {
							setDiscord(e.target.value)
						}}
						id="edit-dao-discord"
					/>
				</div>
			</div>

			<div className="edit-dao__buttons">
				<Button disabled={!name || processing} onClick={handleSave}>
					{processing ? "Saving..." : "Save Changes"}
				</Button>
				<Button buttonType="link" onClick={onClose}>
					Cancel
				</Button>
			</div>
		</div>
	)
}

export default EditDAO
