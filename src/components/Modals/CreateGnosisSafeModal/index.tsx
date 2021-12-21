import {isAddress} from "@ethersproject/address"
import {ChangeEvent, FunctionComponent, useContext, useEffect, useState} from "react"
import createGnosisSafe from "../../../api/ethers/functions/gnosisSafe/createGnosisSafe"
import addDAO from "../../../api/firebase/DAO/addDAO"
import editDAO from "../../../api/firebase/DAO/editDAO"
import {AuthContext} from "../../../context/AuthContext"
import ArrayInput from "../../Controls/ArrayInput"
import Button from "../../Controls/Button"
import Input from "../../Controls/Input"
import RadioButton from "../../Controls/RadioButton"
import {toastError, toastSuccess} from "../../UI/Toast"
import Modal from "../Modal"
import "./styles.scss"

type CreateGnosisSafeStage = "chooseOption" | "create" | "import" | "success"

const CreateGnosisSafeModal: FunctionComponent<{
	afterCreate: () => void
}> = ({afterCreate}) => {
	const [isOpened, setIsOpened] = useState(false)

	const {account, signer} = useContext(AuthContext)
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
			console.log("TODO: Implement importing Gnosis Safe")
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

	const title =
		stage === "create"
			? "Create Gnosis Safe"
			: stage === "import"
			? "Load Existing Gnosis Safe"
			: "Start a DAO"

	const submitButtonText = processing
		? "Processing..."
		: stage === "create" || stage === "import"
		? "Submit"
		: "Continue"

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
