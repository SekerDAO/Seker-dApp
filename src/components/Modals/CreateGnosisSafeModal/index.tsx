import {ChangeEvent, FunctionComponent, useContext, useEffect, useState} from "react"
import Button from "../../Controls/Button"
import Modal from "../Modal"
import {AuthContext} from "../../../context/AuthContext"
import RadioButton from "../../Controls/RadioButton"
import Input from "../../Controls/Input"
import createGnosisSafe from "../../../api/ethers/functions/gnosisSafe/createGnosisSafe"
import EthersContext from "../../../context/EthersContext"
import {toastError, toastSuccess} from "../../UI/Toast"
import addDAO from "../../../api/firebase/DAO/addDAO"
import "./styles.scss"
import editDAO from "../../../api/firebase/DAO/editDAO"
import ArrayInput from "../../Controls/ArrayInput"
import {isAddress} from "@ethersproject/address"

type CreateGnosisSafeStage = "chooseOption" | "create" | "import" | "success"

const CreateGnosisSafeModal: FunctionComponent<{
	afterCreate: () => void
}> = ({afterCreate}) => {
	const [isOpened, setIsOpened] = useState(false)

	const {account} = useContext(AuthContext)
	const {signer} = useContext(EthersContext)
	const [processing, setProcessing] = useState(false)
	const [stage, setStage] = useState<CreateGnosisSafeStage>("chooseOption")
	const [newGnosis, setNewGnosis] = useState(true)
	const [daoName, setDaoName] = useState("")
	const [votingThreshold, setVotingThreshold] = useState("")
	const [members, setMembers] = useState<string[]>([])
	useEffect(() => {
		if (account) {
			setMembers([account])
		}
	}, [account])

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
		if (stage === "chooseOption") {
			if (newGnosis) {
				setStage("create")
			} else {
				console.log("TODO")
			}
		} else if (stage === "create") {
			if (!(account && signer && votingThreshold)) return
			setProcessing(true)
			try {
				const gnosisAddress = await createGnosisSafe(members, Number(votingThreshold), signer)
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
	}

	const submitButtonDisabled =
		processing ||
		(stage === "create" &&
			!(
				daoName &&
				votingThreshold &&
				!isNaN(Number(votingThreshold)) &&
				Number(votingThreshold) > 0 &&
				Number(votingThreshold) <= members.length &&
				members.length &&
				members.reduce((acc, cur) => acc && !!cur, true)
			))
	let title = "Start a DAO"
	let submitButtonText = "Continue"
	if (stage === "create") {
		title = "Create Gnosis Safe"
		submitButtonText = "Submit"
	}
	if (processing) {
		submitButtonText = "Processing..."
	}
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
				title={title}
				show={isOpened}
				onClose={() => setIsOpened(false)}
				submitButtonText={submitButtonText}
				onSubmit={handleSubmit}
				submitButtonDisabled={submitButtonDisabled}
			>
				<div className="create-gnosis-safe">
					{stage === "chooseOption" && (
						<>
							<div className="create-gnosis-safe__row">
								<RadioButton
									label="Create Gnosis Safe"
									id="create-gnosis-safe-new"
									checked={newGnosis}
									onChange={() => setNewGnosis(true)}
								/>
							</div>
							<div className="create-gnosis-safe__row">
								<RadioButton
									label="TODO: Load Existing Gnosis Safe"
									id="create-gnosis-safe-existing"
									checked={!newGnosis}
									onChange={() => setNewGnosis(false)}
								/>
							</div>
						</>
					)}
					{stage === "create" && (
						<>
							<label htmlFor="create-gnosis-name">DAO Name</label>
							<Input
								id="create-gnosis-name"
								borders="all"
								value={daoName}
								onChange={e => {
									setDaoName(e.target.value)
								}}
							/>
							<label>Add Admins</label>
							<ArrayInput
								items={members}
								onAdd={handleMemberAdd}
								onRemove={handleMemberRemove}
								placeholder="Paste address and press enter. Add more addresses if needed"
								validator={(value: string) => (isAddress(value) ? null : "Bad address format")}
							/>
							<label htmlFor="create-gnosis-threshold">Admin Voting Threshold</label>
							<Input
								borders="all"
								number
								value={votingThreshold}
								onChange={handleThresholdChange}
							/>
						</>
					)}
				</div>
			</Modal>
		</>
	)
}

export default CreateGnosisSafeModal
