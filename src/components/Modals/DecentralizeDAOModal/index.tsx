import React, {FunctionComponent, useState} from "react"
import Button from "../../Controls/Button"
import Modal from "../Modal"
import RadioButton from "../../Controls/RadioButton"
import CreateERC20Token from "../../DAO/CreateERC20Token"
import DecentralizeDAO from "../../DAO/DecentralizeDAO"
import useDAO from "../../../customHooks/getters/useDAO"
import Loader from "../../Loader"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import "./styles.scss"
import {ERC20Token} from "../../../types/ERC20Token"
import Input from "../../Controls/Input"

type DecentralizeDAOStage = "chooseToken" | "createToken" | "enterInfo" | "success"

const DecentralizeDAOModalContent: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	afterSubmit: () => void
}> = ({gnosisAddress, gnosisVotingThreshold, afterSubmit}) => {
	const [stage, setStage] = useState<DecentralizeDAOStage>("chooseToken")
	const [tokenSource, setTokenSource] = useState<"new" | "existing" | "import">("existing")
	const [token, setToken] = useState("")
	const [totalSupply, setTotalSupply] = useState("")
	const {dao, loading, error} = useDAO(gnosisAddress)

	const handleSubmit = () => {
		if (stage === "chooseToken") {
			if (tokenSource === "new") {
				setStage("createToken")
			} else if (tokenSource === "existing" && token) {
				setStage("enterInfo")
			}
		} else if (stage === "enterInfo") {
			afterSubmit()
			setStage("success")
		}
	}

	const handleERC20Create = (_token: ERC20Token) => {
		setToken(_token.address)
		setTotalSupply(String(_token.totalSupply))
		setStage("enterInfo")
	}

	if (!dao || loading) return <Loader />
	if (error) return <ErrorPlaceholder />

	const submitButtonDisabled = tokenSource === "existing" && !token

	return (
		<div className="decentralize-dao">
			{stage === "chooseToken" && (
				<>
					<h2>Decentralize DAO</h2>
					<p>Step 1. Choose one.</p>
					<div className="decentralize-dao__row">
						<RadioButton
							label="Your Existing Token(s)"
							id="decentralize-dao-existing-token"
							checked={tokenSource === "existing"}
							onChange={() => {
								setTokenSource("existing")
							}}
						/>
						<Input
							borders="all"
							onChange={e => {
								setToken(e.target.value)
							}}
							value={token}
						/>
					</div>
					<div className="decentralize-dao__row">
						<RadioButton
							label="Create New Token"
							id="decentralize-dao-new-token"
							checked={tokenSource === "new"}
							onChange={() => {
								setTokenSource("new")
							}}
						/>
					</div>
					<div className="decentralize-dao__row">
						<RadioButton
							label="TODO: Import Token"
							id="decentralize-dao-import-token"
							checked={tokenSource === "import"}
							onChange={() => {
								setTokenSource("import")
							}}
							disabled
						/>
					</div>
					<Button buttonType="primary" onClick={handleSubmit} disabled={submitButtonDisabled}>
						Continue
					</Button>
				</>
			)}
			{stage === "createToken" && <CreateERC20Token afterCreate={handleERC20Create} />}
			{stage === "enterInfo" && (
				<DecentralizeDAO
					gnosisAddress={gnosisAddress}
					gnosisVotingThreshold={gnosisVotingThreshold}
					afterCreate={handleSubmit}
					tokenAddress={token}
					totalSupply={Number(totalSupply)}
				/>
			)}
			{stage === "success" && (
				<>
					<h2>Success!</h2>
					<p>
						You can now see the DAO you have created (along with
						<br />
						other DAOs you currently belong to) and access the DAO dashboard
						<br />
						on the &quot;View Your DAOs&quot; page of your profile dashboard.
					</p>
				</>
			)}
		</div>
	)
}

const DecentralizeDAOModal: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	afterSubmit: () => void
}> = ({gnosisAddress, afterSubmit, gnosisVotingThreshold}) => {
	const [isOpened, setIsOpened] = useState(false)

	return (
		<>
			<Button
				buttonType="primary"
				onClick={() => {
					setIsOpened(true)
				}}
			>
				Decentralize DAO
			</Button>
			<Modal
				show={isOpened}
				onClose={() => {
					setIsOpened(false)
				}}
			>
				<DecentralizeDAOModalContent
					afterSubmit={afterSubmit}
					gnosisAddress={gnosisAddress}
					gnosisVotingThreshold={gnosisVotingThreshold}
				/>
			</Modal>
		</>
	)
}

export default DecentralizeDAOModal
