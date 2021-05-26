import React, {FunctionComponent, useState} from "react"
import Button from "../Controls/Button"
import Modal from "../Modal"
import RadioButton from "../Controls/RadioButton"
import Select from "../Controls/Select"
import ImageUpload from "../Controls/ImageUpload"
import Input from "../Controls/Input"
import "./styles.scss"

type CreateNFTModalStage = "chooseOption" | "chooseDomain" | "uploadFile" | "loadExisting" | "success"

const CreateNFTModal: FunctionComponent = () => {
	const [isOpened, setIsOpened] = useState(false)
	const [stage, setStage] = useState<CreateNFTModalStage>("chooseOption")
	const [loadExisting, setLoadExisting] = useState(false)
	const [customDomain, setCustomDomain] = useState(false)
	const [customDomainName, setCustomDomainName] = useState("")
	const [file, setFile] = useState<File | null>(null)
	const [title, setTitle] = useState("")
	const [numberOfEditions, setNumberOfEditions] = useState("")
	const [tokenAddress, setTokenAddress] = useState("")
	const [tokenID, setTokenID] = useState("")

	const handleClose = () => {
		setIsOpened(false)
		setStage("chooseOption")
		setLoadExisting(false)
		setCustomDomain(false)
		setFile(null)
		setTitle("")
		setNumberOfEditions("")
		setTokenAddress("")
		setTokenID("")
	}

	const handleSubmit = () => {
		if (stage === "chooseOption") {
			if (loadExisting) {
				setStage("loadExisting")
			} else {
				setStage("chooseDomain")
			}
		} else if (stage === "chooseDomain") {
			if (customDomain && !customDomainName) return
			setStage("uploadFile")
		} else if (stage === "uploadFile" && file && title && numberOfEditions) {
			//console.log("create new")
		} else if (stage === "loadExisting" && tokenID && tokenAddress) {
			//console.log("load existing")
		}
	}

	const submitButtonDisabled =
		(stage === "chooseDomain" && customDomain && !customDomainName) ||
		(stage === "uploadFile" && !(file && title && numberOfEditions)) ||
		(stage === "loadExisting" && !(tokenID && tokenID))

	return (
		<>
			<Button
				buttonType="secondary"
				onClick={() => {
					setIsOpened(true)
				}}
			>
				Create / Load NFT
			</Button>
			<Modal show={isOpened} onClose={handleClose}>
				<div className="create-nft">
					{stage === "chooseOption" && (
						<>
							<h2>Create / load NFT</h2>
							<p>Step 1: Choose one.</p>
							<div className="create-nft__row">
								<RadioButton
									id="create-new-nft-radio"
									label="Create a new NFT"
									checked={!loadExisting}
									onChange={() => {
										setLoadExisting(false)
									}}
								/>
							</div>
							<div className="create-nft__row">
								<RadioButton
									id="load-existing-nft-radio"
									label="Load an existing NFT"
									checked={loadExisting}
									onChange={() => {
										setLoadExisting(true)
									}}
								/>
							</div>
						</>
					)}
					{stage === "chooseDomain" && (
						<>
							<h2>Create NFT</h2>
							<p>Step 2. Choose domain option.</p>
							<div className="create-nft__row">
								<RadioButton
									label="Your Personal Domain(s)"
									id="create-nft-radio-pers-domain"
									checked={customDomain}
									onChange={() => {
										setCustomDomain(true)
									}}
								/>
								<Select
									options={[
										{
											name: "Select Domain",
											value: ""
										}
									]} // TODO
									disabled={!customDomain}
									onChange={e => {
										setCustomDomainName(e.target.value)
									}}
								/>
							</div>
							<div className="create-nft__row">
								<RadioButton
									label="TokenWalk Domain"
									id="create-nft-radio-tw-domain"
									checked={!customDomain}
									onChange={() => {
										setCustomDomain(false)
									}}
								/>
							</div>
						</>
					)}
					{stage === "uploadFile" && (
						<>
							<h2>Create NFT</h2>
							<p>Step 3. Input NFT Information</p>
							<ImageUpload
								onUpload={image => {
									setFile(image)
								}}
							/>
							<div className="create-nft__row">
								<div className="create-nft__col">
									<label>Title Of Piece</label>
									<Input
										borders="all"
										value={title}
										onChange={e => {
											setTitle(e.target.value)
										}}
									/>
								</div>
								<div className="create-nft__col">
									<label># of Editions</label>
									<Input
										number
										borders="all"
										value={numberOfEditions}
										onChange={e => {
											setNumberOfEditions(e.target.value)
										}}
									/>
								</div>
							</div>
						</>
					)}
					{stage === "loadExisting" && (
						<>
							<h2>Load NFT</h2>
							<label>NFT Token Address</label>
							<Input
								borders="all"
								value={tokenAddress}
								onChange={e => {
									setTokenAddress(e.target.value)
								}}
							/>
							<label>NFT Token ID</label>
							<Input
								borders="all"
								value={tokenID}
								onChange={e => {
									setTokenID(e.target.value)
								}}
							/>
						</>
					)}
					{stage !== "success" && (
						<Button buttonType="primary" onClick={handleSubmit} disabled={submitButtonDisabled}>
							{stage === "uploadFile" || stage === "loadExisting" ? "Submit" : "Continue"}
						</Button>
					)}
				</div>
			</Modal>
		</>
	)
}

export default CreateNFTModal
