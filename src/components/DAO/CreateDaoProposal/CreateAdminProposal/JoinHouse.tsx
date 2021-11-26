import {AuthContext} from "../../../../context/AuthContext"
import EthersContext from "../../../../context/EthersContext"
import Button from "../../../Controls/Button"
import Input from "../../../Controls/Input"
import {toastError, toastSuccess} from "../../../UI/Toast"
import {FunctionComponent, useContext, useState} from "react"

const JoinHouse: FunctionComponent<{
	gnosisAddress: string
	daoAddress: string
}> = () => {
	const {account} = useContext(AuthContext)
	const {provider, signer} = useContext(EthersContext)
	const [loading, setLoading] = useState(false)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")

	const handleSubmit = async () => {
		if (!(provider && signer && account)) return
		setLoading(true)
		try {
			console.log("TODO")
			// const proposalId = await createEnterERC20DAOProposal(daoAddress, provider, signer)
			// await addProposal({
			// 	id: proposalId,
			// 	module: "DAO",
			// 	type: "joinHouse",
			// 	gnosisAddress,
			// 	userAddress: account,
			// 	title,
			// 	...(description ? {description} : {})
			// })
			toastSuccess("Proposal successfully created")
			setTitle("")
			setDescription("")
		} catch (e) {
			console.error(e)
			toastError("Failed to create proposal")
		}
		setLoading(false)
	}

	return (
		<>
			<label htmlFor="join-house-title">Title</label>
			<Input
				id="join-house-title"
				onChange={e => {
					setTitle(e.target.value)
				}}
				value={title}
			/>
			<label htmlFor="join-house-desc">Description</label>
			<Input
				id="join-house-desc"
				onChange={e => {
					setDescription(e.target.value)
				}}
				value={description}
			/>
			<Button
				onClick={handleSubmit}
				disabled={loading || !title}
				extraClassName="create-dao-proposal__submit-button"
			>
				{loading ? "Processing..." : "Create Proposal"}
			</Button>
		</>
	)
}

export default JoinHouse
