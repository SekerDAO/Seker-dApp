import React, {FunctionComponent, useState} from "react"
import {DAO} from "../../../types/DAO"
import "./styles.scss"
import Input from "../../Controls/Input"
import Button from "../../Controls/Button"
import {toastError, toastSuccess} from "../../Toast"
import editDAO from "../../../api/firebase/DAO/editDAO"

//TODO: url validations
const EditDAO: FunctionComponent<{
	dao: DAO
	onClose: () => void
}> = ({dao, onClose}) => {
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
				address: dao.address,
				name,
				description,
				website,
				twitter,
				telegram,
				discord
			})
			toastSuccess("DAO Successfully edited")
			onClose()
		} catch (e) {
			console.error(e)
			toastError("Failed to update DAO")
		}
		setProcessing(false)
	}

	return (
		<div className="edit-dao">
			<label htmlFor="edit-dao-name">Display Name</label>
			<Input
				borders="all"
				value={name}
				onChange={e => {
					setName(e.target.value)
				}}
				id="edit-dao-name"
			/>
			<label htmlFor="edit-dao-desc">About House</label>
			<Input
				borders="all"
				value={description}
				onChange={e => {
					setDescription(e.target.value)
				}}
				id="edit-dao-desc"
			/>
			<label htmlFor="edit-dao-website">Website</label>
			<Input
				borders="all"
				value={website}
				onChange={e => {
					setWebsite(e.target.value)
				}}
				id="edit-dao-website"
			/>
			<label htmlFor="edit-dao-tw">Twitter URL</label>
			<Input
				borders="all"
				value={twitter}
				onChange={e => {
					setTwitter(e.target.value)
				}}
				id="edit-dao-tw"
			/>
			<label htmlFor="edit-dao-tg">Telegram URL</label>
			<Input
				borders="all"
				value={telegram}
				onChange={e => {
					setTelegram(e.target.value)
				}}
				id="edit-dao-tg"
			/>
			<label htmlFor="edit-dao-discord">Discord URL</label>
			<Input
				borders="all"
				value={discord}
				onChange={e => {
					setDiscord(e.target.value)
				}}
				id="edit-dao-discord"
			/>
			<div className="edit-dao__buttons">
				<Button disabled={!name || processing} onClick={handleSave}>
					{processing ? "Saving..." : "Save"}
				</Button>
				<Button buttonType="secondary" onClick={onClose}>
					Cancel
				</Button>
			</div>
		</div>
	)
}

export default EditDAO
