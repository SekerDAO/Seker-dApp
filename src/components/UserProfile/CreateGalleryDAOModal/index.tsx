import React, {ChangeEvent, FunctionComponent, useState} from "react"
import Button from "../../Controls/Button"
import Modal from "../../Modal"
import RadioButton from "../../Controls/RadioButton"
import Select from "../../Controls/Select"
import CreateERC20Token from "../CreateERC20Token"
import CreateDAO from "../CreateDAO"
import useMyERC20Tokens from "../../../api/firebase/useMyERC20Tokens"

type CreateGalleryDAOStage = "chooseToken" | "createToken" | "enterInfo" | "success"

const CreateGalleryDAOModal: FunctionComponent = () => {
	const [isOpened, setIsOpened] = useState(false)
	const [stage, setStage] = useState<CreateGalleryDAOStage>("chooseToken")
	const [tokenSource, setTokenSource] = useState<"new" | "existing" | "import">("existing")
	const [token, setToken] = useState("")
	const [name, setName] = useState("")
	const [totalSupply, setTotalSupply] = useState("")
	const {tokens, loading: tokensLoading, error: tokensError} = useMyERC20Tokens()

	const handleClose = () => {
		setIsOpened(false)
		setStage("chooseToken")
		setTokenSource("existing")
		setToken("")
		setName("")
		setTotalSupply("")
	}

	const handleTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const tkn = tokens.find(tok => tok.address === e.target.value)
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

	const handleERC20Create = (newName: string, symbol: string, address: string, newTotalSupply: number) => {
		setName(newName)
		setToken(address)
		setTotalSupply(String(newTotalSupply))
		setStage("enterInfo")
	}

	const submitButtonDisabled = tokenSource === "existing" && !token

	return (
		<>
			<Button
				buttonType="primary"
				onClick={() => {
					setIsOpened(true)
				}}
			>
				Create A Gallery DAO
			</Button>
			<Modal show={isOpened} onClose={handleClose}>
				<div className={`create-dao${stage === "enterInfo" ? " create-dao--wide" : ""}`}>
					{stage === "chooseToken" && (
						<>
							<h2>Create Gallery DAO</h2>
							<p>Step 1. Choose one.</p>
							<div className="create-dao__row">
								<RadioButton
									label="Select Existing Token"
									id="create-gallery-dao-existing-token"
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
							<div className="create-dao__row">
								<RadioButton
									label="Create New Token"
									id="create-gallery-dao-new-token"
									checked={tokenSource === "new"}
									onChange={() => {
										setTokenSource("new")
									}}
								/>
							</div>
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
							<Button buttonType="primary" onClick={handleSubmit} disabled={submitButtonDisabled}>
								Continue
							</Button>
						</>
					)}
					{stage === "createToken" && <CreateERC20Token afterCreate={handleERC20Create} />}
					{stage === "enterInfo" && (
						<CreateDAO
							afterCreate={handleSubmit}
							tokenAddress={token}
							initialName={name}
							totalSupply={Number(totalSupply)}
							DAOType="gallery"
							tokenType="ERC20"
						/>
					)}
					{stage === "success" && (
						<>
							<h2>Success!</h2>
							<p>
								You can now see the gallery DAO you have created
								<br />
								(along with other DAOs you currently belong to) and access the DAO
								<br />
								dashboard on the &quot;View Your DAOs&quot; page of your user dashboard.
							</p>
						</>
					)}
				</div>
			</Modal>
		</>
	)
}

export default CreateGalleryDAOModal
