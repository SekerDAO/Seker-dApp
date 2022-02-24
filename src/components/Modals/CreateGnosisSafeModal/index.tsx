import {isAddress} from "@ethersproject/address"
import {ChangeEvent, FunctionComponent, useContext, useEffect, useState} from "react"
import createGnosisSafe from "../../../api/ethers/functions/gnosisSafe/createGnosisSafe"
import addDAO from "../../../api/firebase/DAO/addDAO"
import editDAO from "../../../api/firebase/DAO/editDAO"
import {AuthContext} from "../../../context/AuthContext"
import useCheckNetwork from "../../../hooks/useCheckNetwork"
import ArrayInput from "../../Controls/ArrayInput"
import Button from "../../Controls/Button"
import Input from "../../Controls/Input"
import {toastError, toastSuccess} from "../../UI/Toast"
import Modal from "../Modal"
import "./styles.scss"

const CreateGnosisSafeModal: FunctionComponent<{
	afterCreate: () => void
}> = ({afterCreate}) => {
	const [isOpened, setIsOpened] = useState(false)

	const {account, signer} = useContext(AuthContext)
	const [processing, setProcessing] = useState(false)
	const [daoName, setDaoName] = useState("")
	const [votingThreshold, setVotingThreshold] = useState("")
	const [members, setMembers] = useState<string[]>([])

	useEffect(() => {
		if (account) {
			setMembers([account])
		}
	}, [account])

	const checkedCreateGnosisSafe = useCheckNetwork(createGnosisSafe)

	const handleMemberRemove = (index: number) => {
		setMembers(prevState => prevState.filter((_, idx) => idx !== index))
	}

	const handleMemberAdd = (newMember: string) => {
		setMembers(prevState => [...prevState, newMember])
	}

	const handleThresholdChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) > members.length) {
			setVotingThreshold(String(members.length))
		} else if (Number(e.target.value) < 0) {
			setVotingThreshold("0")
		} else {
			setVotingThreshold(e.target.value)
		}
	}

	const handleSubmit = async () => {
		if (!(account && signer && votingThreshold)) return
		setProcessing(true)
		try {
			const gnosisAddress = await checkedCreateGnosisSafe(members, Number(votingThreshold), signer)
			await addDAO(gnosisAddress)
			await editDAO({gnosisAddress, name: daoName})
			toastSuccess("DAO successfully created!")
			setIsOpened(false)
			afterCreate()
		} catch (e) {
			console.error(e)
			toastError("Failed to create DAO")
		}
		setProcessing(false)
	}

	const submitButtonDisabled =
		processing ||
		!(
			daoName &&
			votingThreshold &&
			!isNaN(Number(votingThreshold)) &&
			Number(votingThreshold) > 0 &&
			Number(votingThreshold) <= members.length &&
			members.length &&
			members.reduce((acc, cur) => acc && !!cur, true)
		)

	return (
		<>
			<Button
				buttonType="primary"
				onClick={() => {
					setIsOpened(true)
				}}
			>
				Start a DAO
			</Button>
			<Modal
				title="Create Gnosis Safe"
				show={isOpened}
				onClose={() => setIsOpened(false)}
				submitButtonText={processing ? "Processing..." : "Submit"}
				onSubmit={handleSubmit}
				submitButtonDisabled={submitButtonDisabled}
				warningMessages={[
					`This request will incur a gas fee. If you would like to proceed, please click "Submit" below.`
				]}
			>
				<div className="create-gnosis-safe">
					<div className="create-gnosis-safe__row">
						<label htmlFor="create-gnosis-name">DAO Name</label>
						<Input
							id="create-gnosis-name"
							borders="all"
							value={daoName}
							onChange={e => {
								setDaoName(e.target.value)
							}}
						/>
					</div>
					<div className="create-gnosis-safe__row">
						<label>Add Admins(s)</label>
						<ArrayInput
							items={members}
							onAdd={handleMemberAdd}
							onRemove={handleMemberRemove}
							placeholder="Paste address and press enter or tab"
							validator={(value: string) => (isAddress(value) ? null : "Bad address format")}
						/>
					</div>
					<div className="create-gnosis-safe__row">
						<label htmlFor="create-gnosis-threshold">Admin Voting Threshold</label>
						<Input
							borders="all"
							number
							step={1}
							min={1}
							max={members.length}
							value={votingThreshold}
							onChange={handleThresholdChange}
						/>
					</div>
				</div>
			</Modal>
		</>
	)
}

export default CreateGnosisSafeModal
