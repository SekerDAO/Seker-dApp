import React, {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import Button from "../../Controls/Button"
import Modal from "../../Modal"
import {HouseDAOTokenType} from "../../../types/DAO"
import RadioButton from "../../Controls/RadioButton"
import Select from "../../Controls/Select"
import CreateERC20Token from "../CreateERC20Token"
import CreateDAO from "../CreateDAO"
import useNFTs from "../../../customHooks/useNFTs"
import {AuthContext} from "../../../context/AuthContext"
import useMyERC20Tokens from "../../../api/firebase/useMyERC20Tokens"
import {ERC20Token} from "../../../types/ERC20Token"
import {NFT} from "../../../types/NFT"

type CreateHouseDAOStage = "chooseType" | "chooseToken" | "createToken" | "enterInfo" | "success"

const CreateHouseDAOModal: FunctionComponent = () => {
	const [isOpened, setIsOpened] = useState(false)
	const [stage, setStage] = useState<CreateHouseDAOStage>("chooseType")
	const [tokenType, setTokenType] = useState<HouseDAOTokenType>("ERC20")
	const [tokenSource, setTokenSource] = useState<"new" | "existing" | "import">("existing")
	const [token, setToken] = useState("")
	const [name, setName] = useState("")
	const [totalSupply, setTotalSupply] = useState("")
	const {account} = useContext(AuthContext)
	const {NFTs, loading: NFTsLoading, error: NFTsError} = useNFTs({user: account!, limit: 0, after: null})
	const {tokens, loading: tokensLoading, error: tokensError} = useMyERC20Tokens()

	const handleClose = () => {
		setIsOpened(false)
		setStage("chooseType")
		setTokenSource("existing")
		setToken("")
		setName("")
		setTotalSupply("")
	}

	const handleTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const tkn =
			tokenType === "NFT"
				? NFTs.data.map(nft => nft.data()).find(tok => tok.address === e.target.value)
				: tokens.find(tok => tok.address === e.target.value)
		if (!tkn) {
			setToken("")
			setName("")
			setTotalSupply("")
			return
		}
		setToken(tkn.address)
		setName(tkn.name)
		if (tokenType === "ERC20") {
			setTotalSupply(String((tkn as ERC20Token).totalSupply))
		}
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
									].concat(
										(tokenType === "NFT"
											? NFTs.data.map(nft => nft.data())
											: tokens
										).map((tkn: ERC20Token | Omit<NFT, "id">) => ({name: tkn.name, value: tkn.address}))
									)}
									disabled={
										tokenSource !== "existing" ||
										(tokenType === "ERC20" && (tokensLoading || tokensError)) ||
										(tokenType === "NFT" && (NFTsLoading || NFTsError))
									}
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
