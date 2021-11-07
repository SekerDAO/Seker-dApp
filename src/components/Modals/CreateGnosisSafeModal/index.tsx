import {ChangeEvent, FunctionComponent, useContext, useEffect, useState} from "react"
import Button from "../../Controls/Button"
import Modal from "../Modal"
import {AuthContext} from "../../../context/AuthContext"
import RadioButton from "../../Controls/RadioButton"
import Input from "../../Controls/Input"
import createGnosisSafe from "../../../api/ethers/functions/gnosisSafe/createGnosisSafe"
import EthersContext from "../../../context/EthersContext"
import {toastError, toastSuccess, toastWarning} from "../../UI/Toast"
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
	const [gnosisSafeAddress, setGnosisSafeAddress] = useState("")
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
		} else {
			setVotingThreshold(e.target.value)
		}
	}

	const handleSubmit = async () => {
		if (stage === "chooseOption") {
			if (newGnosis) {
				setStage("create")
			} else {
				setStage("import")
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
		} else if (stage === "import") {
			toastWarning("This feature is not yet supported. Please, try later.")
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
			)) ||
		(stage === "import" && !gnosisSafeAddress)

	let title = "Start a DAO"
	let submitButtonText = "Continue"
	if (stage === "create") {
		title = "Create Gnosis Safe"
	} else if (stage === "import") {
		title = "Load Existing Gnosis Safe"
	}

	if (processing) {
		submitButtonText = "Processing..."
	} else if (stage === "create" || stage === "import") {
		submitButtonText = "Submit"
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
				warningMessage={
					stage === "create"
						? `This request will incur a gas fee. If you would like to proceed, please click "Submit" below.`
						: undefined
				}
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
									label="Load Existing Gnosis Safe"
									id="create-gnosis-safe-existing"
									checked={!newGnosis}
									onChange={() => setNewGnosis(false)}
								/>
							</div>
						</>
					)}
					{stage === "create" && (
						<>
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
						</>
					)}
					{stage === "import" && (
						<div className="create-gnosis-safe__row">
							<label htmlFor="import-gnosis-address">Gnosis Safe Address</label>
							<Input
								borders="all"
								value={gnosisSafeAddress}
								onChange={e => setGnosisSafeAddress(e.target.value)}
								validation={
									gnosisSafeAddress && !isAddress(gnosisSafeAddress) ? "Bad address format" : null
								}
							/>
						</div>
					)}
				</div>
			</Modal>
		</>
	)
}

export default CreateGnosisSafeModal
