import React, {FunctionComponent, useContext, useState} from "react"
import Input from "../../Controls/Input"
import Button from "../../Controls/Button"
import EthersContext from "../../../context/EthersContext"
import {createEnterERC20DAOProposal} from "../../../api/ethers/functions/ERC20DAO/createERC20DAOProposals"
import {toastError, toastSuccess} from "../../Toast"
import addProposal from "../../../api/firebase/proposal/addProposal"
import {AuthContext} from "../../../context/AuthContext"

const JoinHouse: FunctionComponent<{
	daoAddress: string
}> = ({daoAddress}) => {
	const {account} = useContext(AuthContext)
	const {provider, signer} = useContext(EthersContext)
	const [loading, setLoading] = useState(false)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")

	const handleSubmit = async () => {
		if (!(provider && signer && account)) return
		setLoading(true)
		try {
			const proposalId = await createEnterERC20DAOProposal(daoAddress, provider, signer)
			await addProposal({
				id: proposalId,
				type: "joinHouse",
				daoAddress,
				userAddress: account,
				title,
				...(description ? {description} : {})
			})
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
				borders="all"
				id="join-house-title"
				onChange={e => {
					setTitle(e.target.value)
				}}
				value={title}
			/>
			<label htmlFor="join-house-desc">Description</label>
			<Input
				borders="all"
				id="join-house-desc"
				onChange={e => {
					setDescription(e.target.value)
				}}
				value={description}
			/>
			<Button onClick={handleSubmit} disabled={loading || !title}>
				{loading ? "Processing..." : "Create Proposal"}
			</Button>
		</>
	)
}

export default JoinHouse
