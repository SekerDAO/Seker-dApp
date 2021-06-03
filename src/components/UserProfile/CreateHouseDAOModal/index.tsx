import React, {ChangeEvent, FunctionComponent, useState} from "react"
import Button from "../../Controls/Button"
import Modal from "../../Modal"
import {HouseDAOTokenType} from "../../../types/DAO"
import RadioButton from "../../Controls/RadioButton"
import Select from "../../Controls/Select"
import CreateERC20Token from "../CreateERC20Token"
import CreateDAO from "../CreateDAO"

// TODO
const mockTokens = [
	{
		name: "Mock Token 1",
		address: "0xFF",
		totalSupply: 1000
	},
	{
		name: "Mock Token 2",
		address: "0xAA",
		totalSupply: 10000
	}
]

type CreateHouseDAOStage = "chooseType" | "chooseToken" | "createToken" | "enterInfo" | "success"

const CreateHouseDAOModal: FunctionComponent = () => {
	const [isOpened, setIsOpened] = useState(false)
	const [stage, setStage] = useState<CreateHouseDAOStage>("chooseType")
	const [tokenType, setTokenType] = useState<HouseDAOTokenType>("ERC20")
	const [tokenSource, setTokenSource] = useState<"new" | "existing" | "import">("existing")
	const [token, setToken] = useState("")
	const [name, setName] = useState("")
	const [totalSupply, setTotalSupply] = useState("")

	const handleClose = () => {
		setIsOpened(false)
		setStage("chooseType")
		setTokenSource("existing")
		setToken("")
		setName("")
		setTotalSupply("")
	}

	const handleTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const tkn = mockTokens.find(tok => tok.address === e.target.value)
		if (!tkn) {
			setToken("")
			setName("")
			setTotalSupply("")
			return
		}
		setToken(tkn.address)
		setName(tkn.name)
		setTotalSupply(String(tkn.totalSupply))
	}

	const handleSubmit = () => {
		if (stage === "chooseType") {
			setStage("chooseToken")
		} else if (stage === "chooseToken") {
			if (tokenSource === "new" && tokenType === "ERC20") {
				setStage("createToken")
			} else if (tokenSource === "existing" && token) {
				setStage("enterInfo")
			}
		} else if (stage === "enterInfo") {
			setStage("success")
		}
	}

	const handleERC20Create = (newName: string, symbol: string, address: string, newTotalSupply: number) => {
		setName(newName)
		setToken(address)
		setTotalSupply(String(newTotalSupply))
		setStage("enterInfo")
	}

	const submitButtonDisabled = stage === "chooseToken" && tokenSource === "existing" && !token

	return (
		<>
			<Button
				buttonType="secondary"
				onClick={() => {
					setIsOpened(true)
				}}
			>
				Create A House DAO
			</Button>
			<Modal show={isOpened} onClose={handleClose}>
				<div className={`create-dao${stage === "enterInfo" ? " create-dao--wide" : ""}`}>
					{stage === "chooseType" && (
						<>
							<h2>Create a House DAO</h2>
							<p>Step 1. Choose DAO Type.</p>
							<div className="create-dao__row">
								<RadioButton
									label="Token DAO"
									id="create-house-dao-erc20"
									checked={tokenType === "ERC20"}
									onChange={() => {
										setTokenType("ERC20")
									}}
								/>
							</div>
							<div className="create-dao__row">
								<RadioButton
									label="Admission by NFT"
									id="create-house-dao-nft"
									checked={tokenType === "NFT"}
									onChange={() => {
										setTokenType("NFT")
									}}
								/>
							</div>
						</>
					)}
					{stage === "chooseToken" && (
						<>
							<h2>Create House DAO</h2>
							<p>Step 2. Choose one.</p>
							<div className="create-dao__row">
								<RadioButton
									label="Select Existing Token"
									id="create-house-dao-existing-token"
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
									].concat(mockTokens.map(tkn => ({name: tkn.name, value: tkn.address})))}
									disabled={tokenSource !== "existing"}
									onChange={handleTokenChange}
								/>
							</div>
							{tokenType === "ERC20" && (
								<div className="create-dao__row">
									<RadioButton
										label="Create New Token"
										id="create-house-dao-new-token"
										checked={tokenSource === "new"}
										onChange={() => {
											setTokenSource("new")
										}}
									/>
								</div>
							)}
							<div className="create-dao__row">
								<RadioButton
									label="TODO: Import Token"
									id="create-house-dao-import-token"
									checked={tokenSource === "import"}
									onChange={() => {
										setTokenSource("import")
									}}
									disabled
								/>
							</div>
						</>
					)}
					{stage === "createToken" && <CreateERC20Token afterCreate={handleERC20Create} />}
					{stage === "enterInfo" && (
						<CreateDAO
							afterCreate={handleSubmit}
							tokenAddress={token}
							initialName={name}
							totalSupply={Number(totalSupply)}
							DAOType="house"
							tokenType={tokenType}
						/>
					)}
					{stage === "success" && (
						<>
							<h2>Success!</h2>
							<p>
								You can now see the house DAO you have created
								<br />
								(along with other DAOs you currently belong to) and access the DAO
								<br />
								dashboard on the &quot;View Your DAOs&quot; page of your user dashboard.
							</p>
						</>
					)}
					{["chooseType", "chooseToken"].includes(stage) && (
						<Button buttonType="primary" onClick={handleSubmit} disabled={submitButtonDisabled}>
							Continue
						</Button>
					)}
				</div>
			</Modal>
		</>
	)
}

export default CreateHouseDAOModal
