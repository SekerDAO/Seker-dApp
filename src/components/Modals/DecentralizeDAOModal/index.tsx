import React, {ChangeEvent, FunctionComponent, useState} from "react"
import Button from "../../Controls/Button"
import Modal from "../Modal"
import RadioButton from "../../Controls/RadioButton"
import Select from "../../Controls/Select"
import CreateERC20Token from "../../DAO/CreateERC20Token"
import DecentralizeDAO from "../../DAO/DecentralizeDAO"
import useMyERC20Tokens from "../../../customHooks/getters/useMyERC20Tokens"
import {DAOType} from "../../../types/DAO"
import {capitalize} from "../../../utlls"
import useDAO from "../../../customHooks/getters/useDAO"
import Loader from "../../Loader"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import "./styles.scss"

type DecentralizeDAOStage = "chooseToken" | "createToken" | "enterInfo" | "success"

const DecentralizeDAOModalContent: FunctionComponent<{
	gnosisAddress: string
	type: DAOType
}> = ({gnosisAddress, type}) => {
	const [stage, setStage] = useState<DecentralizeDAOStage>("chooseToken")
	const [tokenSource, setTokenSource] = useState<"new" | "existing" | "import">("existing")
	const [token, setToken] = useState("")
	const [totalSupply, setTotalSupply] = useState("")
	const {tokens, loading: tokensLoading, error: tokensError} = useMyERC20Tokens()
	const {dao, loading: daoLoading, error: daoError} = useDAO(gnosisAddress)

	const handleTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const tkn = tokens.find(tok => tok.address === e.target.value)
		if (!tkn) {
			setToken("")
			setTotalSupply("")
			return
		}
		setToken(tkn.address)
		setTotalSupply(String(tkn.totalSupply))
	}

	const handleSubmit = () => {
		if (stage === "chooseToken") {
			if (tokenSource === "new") {
				setStage("createToken")
			} else if (tokenSource === "existing" && token) {
				setStage("enterInfo")
			}
		} else if (stage === "enterInfo") {
			setStage("success")
		}
	}

	const handleERC20Create = (
		newName: string,
		symbol: string,
		address: string,
		newTotalSupply: number
	) => {
		setToken(address)
		setTotalSupply(String(newTotalSupply))
		setStage("enterInfo")
	}

	if (!dao || daoLoading) return <Loader />
	if (daoError || tokensError) return <ErrorPlaceholder />

	const submitButtonDisabled = tokenSource === "existing" && !token

	return (
		<div className={`decentralize-dao${stage === "enterInfo" ? " decentralize-dao--wide" : ""}`}>
			{stage === "chooseToken" && (
				<>
					<h2>Decentralize A {capitalize(type)} DAO</h2>
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
						<Select
							options={[
								{
									name: "Select Token",
									value: ""
								}
							].concat(tokens.map(tkn => ({name: tkn.name, value: tkn.address})))}
							disabled={tokenSource !== "existing" || tokensLoading || tokensError}
							onChange={handleTokenChange}
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
					name={dao.name}
					members={dao.members.map(m => m.address)}
					gnosisAddress={gnosisAddress}
					afterCreate={handleSubmit}
					tokenAddress={token}
					totalSupply={Number(totalSupply)}
					DAOType={type}
				/>
			)}
			{stage === "success" && (
				<>
					<h2>Success!</h2>
					<p>
						You can now see the {type} DAO you have created (along with
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
	type: DAOType
}> = ({gnosisAddress, type}) => {
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
				<DecentralizeDAOModalContent gnosisAddress={gnosisAddress} type={type} />
			</Modal>
		</>
	)
}

export default DecentralizeDAOModal
