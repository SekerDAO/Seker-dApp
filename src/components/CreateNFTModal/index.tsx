import React, {FunctionComponent, useState, useContext} from "react"
import Button from "../Controls/Button"
import Modal from "../Modal"
import RadioButton from "../Controls/RadioButton"
import Select from "../Controls/Select"
import MediaUpload from "../Controls/MediaUpload"
import Input from "../Controls/Input"
import EthersContext from "../../context/EthersContext"
import checkNFTOwner from "../../api/ethers/functions/checkNFTOwner"
import {AuthContext} from "../../context/AuthContext"
import getNFTMetadata from "../../api/ethers/functions/getNFTMetadata"
import addNFT from "../../api/firebase/addNFT"
import uploadMedia from "../../api/ipfs/uploadMedia"
import createNFT from "../../api/ethers/functions/createNFT"
import Textarea from "../Controls/Textarea"
import useMyDomains from "../../api/firebase/useMyDomains"
import "./styles.scss"

type CreateNFTModalStage = "chooseOption" | "chooseDomain" | "uploadFile" | "loadExisting" | "success"

const CreateNFTModal: FunctionComponent = () => {
	const [isOpened, setIsOpened] = useState(false)
	const [loading, setLoading] = useState(false)
	const [stage, setStage] = useState<CreateNFTModalStage>("chooseOption")
	const [loadExisting, setLoadExisting] = useState(false)
	const [customDomain, setCustomDomain] = useState(false)
	const [customDomainAddress, setCustomDomainAddress] = useState("")
	const [file, setFile] = useState<File | null>(null)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [numberOfEditions, setNumberOfEditions] = useState("")
	const [tokenAddress, setTokenAddress] = useState("")
	const [tokenID, setTokenID] = useState("")
	const {provider, signer} = useContext(EthersContext)
	const {account} = useContext(AuthContext)
	const {domains, loading: domainsLoading, error: domainsError} = useMyDomains()

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

	const handleSubmit = async () => {
		if (stage === "chooseOption") {
			if (loadExisting) {
				setStage("loadExisting")
			} else {
				setStage("chooseDomain")
			}
		} else if (stage === "chooseDomain") {
			if (customDomain && !customDomainAddress) return
			setStage("uploadFile")
		} else if (stage === "uploadFile" && file && title && numberOfEditions && signer && provider && account) {
			setLoading(true)
			try {
				const [metadata, hashes] = await uploadMedia(file, title, description, Number(numberOfEditions))
				await createNFT(hashes, Number(numberOfEditions), signer, provider, customDomainAddress || undefined)
				await addNFT(
					{
						createdDate: new Date().toISOString(),
						nftName: metadata.name,
						nftDesc: metadata.description,
						nftThumbnail: metadata.image,
						externalUrl: metadata.external_url,
						media: metadata.media,
						attributes: metadata.attributes,
						nftCategory: "art"
					},
					account
				)
				setStage("success")
			} catch (e) {
				console.error(e) // TODO: notification
			}
			setLoading(false)
		} else if (stage === "loadExisting" && tokenID && tokenAddress && account && provider) {
			setLoading(true)
			try {
				const isOwner = await checkNFTOwner(account, tokenAddress, tokenID, provider)
				if (!isOwner) {
					alert("You are not the owner!") // TODO
					setLoading(false)
					return
				}
				const metadata = await getNFTMetadata(tokenAddress, tokenID, provider)
				await addNFT(
					{
						createdDate: new Date().toISOString(),
						nftName: metadata.name,
						nftDesc: metadata.description,
						nftThumbnail: metadata.image,
						externalUrl: metadata.external_url,
						media: metadata.media,
						attributes: metadata.attributes,
						nftCategory: "art"
					},
					account
				)
				setStage("success")
			} catch (e) {
				console.error(e)
			}
			setLoading(false)
		}
	}

	const submitButtonDisabled =
		(stage === "chooseDomain" && customDomain && !customDomainAddress) ||
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
									value={customDomainAddress}
									options={[
										{
											name: "Select Domain",
											value: ""
										}
									].concat(domains.map(domain => ({name: domain.name, value: domain.address})))}
									disabled={!customDomain && domainsLoading && domainsError}
									onChange={e => {
										setCustomDomainAddress(e.target.value)
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
							<MediaUpload
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
										max={50}
										borders="all"
										value={numberOfEditions}
										onChange={e => {
											setNumberOfEditions(e.target.value)
										}}
									/>
								</div>
							</div>
							<label>Description</label>
							<Textarea
								borders="all"
								value={description}
								onChange={e => {
									setDescription(e.target.value)
								}}
							/>
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
					{stage === "success" ? (
						<>
							<h2>Success!</h2>
							<p>
								You now have the ability to delete, sign, or change the
								<br />
								visibility setting of your created NFT on the &quot;Create /<br />
								Edit NFTs&quot; page of your user dashboard.
							</p>
						</>
					) : (
						<Button buttonType="primary" onClick={handleSubmit} disabled={submitButtonDisabled || loading}>
							{stage === "uploadFile" || stage === "loadExisting" ? (loading ? "Processing..." : "Submit") : "Continue"}
						</Button>
					)}
				</div>
			</Modal>
		</>
	)
}

export default CreateNFTModal
