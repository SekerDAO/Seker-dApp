import {ChangeEvent, FunctionComponent, useContext, useEffect, useState} from "react"
import Button from "../../Controls/Button"
import {AuthContext} from "../../../context/AuthContext"
import RadioButton from "../../Controls/RadioButton"
import Input from "../../Controls/Input"
import createGnosisSafe from "../../../api/ethers/functions/gnosisSafe/createGnosisSafe"
import EthersContext from "../../../context/EthersContext"
import {toastError, toastSuccess} from "../../UI/Toast"
import addDAO from "../../../api/firebase/DAO/addDAO"
import PlusIcon from "../../../assets/icons/add.svg"
import "./styles.scss"
import editDAO from "../../../api/firebase/DAO/editDAO"
import ArrayInput from "../../Controls/ArrayInput"
import {isAddress} from "@ethersproject/address"
import Modal from "../Modal"

type CreateGnosisSafeStage = "chooseOption" | "create" | "import" | "success" | "load-existing"

const CreateGnosisSafeModalContent: FunctionComponent<{
	afterCreate: () => void
}> = ({afterCreate}) => {
	const {account} = useContext(AuthContext)
	const {signer} = useContext(EthersContext)
	const [processing, setProcessing] = useState(false)
	const [stage, setStage] = useState<CreateGnosisSafeStage>("chooseOption")
	const [newGnosis, setNewGnosis] = useState<boolean | undefined>()
	const [daoName, setDaoName] = useState("")
	const [gnosisSafeAddress, setGnosisSafeAddress] = useState("")
	const [created, setCreated] = useState<"create-success" | "load-success" | "error" | undefined>()
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
				setStage("load-existing")
			}
		} else if (stage === "create") {
			if (!(account && signer && votingThreshold)) return
			setProcessing(true)
			try {
				const gnosisAddress = await createGnosisSafe(members, Number(votingThreshold), signer)
				await addDAO(gnosisAddress)
				await editDAO({gnosisAddress, name: daoName})
				toastSuccess("DAO successfully created!")
				setCreated("create-success")
				afterCreate()
			} catch (e) {
				console.error(e)
				setCreated("error")
				toastError("Failed to create DAO")
			}
			setProcessing(false)
		} else if (stage === "load-existing") {
			console.log("TODO")
		}
	}

	const submitButtonDisabled =
		typeof newGnosis === "undefined" ||
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

	if (created) {
		return (
			<div className="create-gnosis-safe">
				<h2>{created.includes("success") ? "Success!" : "Failed!"}</h2>

				<div className="create-gnosis-safe__row">
					You can now access your DAO dashboard / information on the &ldquo;View Your DAOs &rdquo;
					page of your profile dashboard.
				</div>
			</div>
		)
	}

	return (
		<div className="create-gnosis-safe">
			{stage === "chooseOption" && (
				<>
					<h2>Start a DAO</h2>
					<div className="create-gnosis-safe__row">
						<RadioButton
							label="Create Gnosis Safe"
							id="create-gnosis-safe-new"
							checked={newGnosis}
							onChange={() => {
								setNewGnosis(true)
							}}
						/>
					</div>
					<div className="create-gnosis-safe__row">
						<RadioButton
							label="TODO: Load Existing Gnosis Safe"
							id="create-gnosis-safe-existing"
							checked={newGnosis === false}
							onChange={() => {
								setNewGnosis(false)
							}}
						/>
					</div>
				</>
			)}
			{stage === "create" && (
				<>
					<h2>Create Gnosis Safe</h2>
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
					<div className="create-gnosis-safe__row">
						<div className="flexed">
							<ArrayInput
								items={members}
								onAdd={handleMemberAdd}
								onRemove={handleMemberRemove}
								placeholder="Paste address and press enter. Add more addresses if needed"
								validator={(value: string) => (isAddress(value) ? null : "Bad address format")}
							/>
						</div>
						<Button type="button">
							<img src={PlusIcon} alt="Add Admin" />
						</Button>
					</div>
					<label htmlFor="create-gnosis-threshold">Admin Voting Threshold</label>
					<Input borders="all" number value={votingThreshold} onChange={handleThresholdChange} />
				</>
			)}
			{stage === "load-existing" && (
				<>
					<h2>Load Existing Gnosis Safe</h2>
					<label htmlFor="create-gnosis-name">Gnosis Safe Address</label>
					<Input
						id="create-gnosis-name"
						borders="all"
						value={gnosisSafeAddress}
						onChange={e => {
							setGnosisSafeAddress(e.target.value)
						}}
					/>
				</>
			)}
			<Button buttonType="primary" onClick={handleSubmit} disabled={submitButtonDisabled}>
				{processing ? "Processing..." : stage === "chooseOption" ? "Continue" : "Submit"}
			</Button>
		</div>
	)
}

const CreateGnosisSafeModal: FunctionComponent<{
	afterCreate: () => void
}> = ({afterCreate}) => {
	const [isOpened, setIsOpened] = useState(false)

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
				show={isOpened}
				onClose={() => {
					setIsOpened(false)
				}}
			>
				<CreateGnosisSafeModalContent
					afterCreate={() => {
						setIsOpened(false)
						afterCreate()
					}}
				/>
			</Modal>
		</>
	)
}

export default CreateGnosisSafeModal
