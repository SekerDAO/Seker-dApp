import React, {FunctionComponent, useState, useContext} from "react"
import Button from "../../Controls/Button"
import Modal from "../Modal"
import RadioButton from "../../Controls/RadioButton"
import Select from "../../Controls/Select"
import MediaUpload from "../../Controls/MediaUpload"
import Input from "../../Controls/Input"
import EthersContext from "../../../context/EthersContext"
import checkNFTOwner from "../../../api/ethers/functions/NFT/checkNFTOwner"
import {AuthContext} from "../../../context/AuthContext"
import getNFTMetadata from "../../../api/ethers/functions/NFT/getNFTMetadata"
import addNFT from "../../../api/firebase/NFT/addNFT"
import uploadMedia from "../../../api/ipfs/uploadMedia"
import createNFT from "../../../api/ethers/functions/NFT/createNFT"
import Textarea from "../../Controls/Textarea"
import useMyDomains from "../../../customHooks/getters/useMyDomains"
import "./styles.scss"
import {toastError} from "../../Toast"
import addDAONFT from "../../../api/firebase/NFT/addDAONFT"
import transferNFT from "../../../api/ethers/functions/NFT/transferNFT"
const {REACT_APP_DOMAIN_ADDRESS} = process.env

type CreateNFTModalStage =
	| "chooseOption"
	| "chooseDomain"
	| "uploadFile"
	| "loadExisting"
	| "success"

const CreateNFTModalContent: FunctionComponent<{
	gnosisAddress?: string
	afterCreate?: () => void
}> = ({gnosisAddress, afterCreate}) => {
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
	const [existingNFTId, setExistingNFTId] = useState("")
	const {provider, signer} = useContext(EthersContext)
	const {account} = useContext(AuthContext)
	const {domains, loading: domainsLoading, error: domainsError} = useMyDomains()

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
		} else if (
			stage === "uploadFile" &&
			file &&
			title &&
			numberOfEditions &&
			signer &&
			provider &&
			account
		) {
			setLoading(true)
			try {
				const [metadata, hashes] = await uploadMedia(
					file,
					title,
					description,
					Number(numberOfEditions)
				)
				const ids = await createNFT(
					hashes,
					Number(numberOfEditions),
					signer,
					provider,
					customDomainAddress || undefined
				)
				const nft = {
					address: customDomain ? customDomainAddress : REACT_APP_DOMAIN_ADDRESS!,
					createdDate: new Date().toISOString(),
					name: metadata.name,
					desc: metadata.description,
					thumbnail: metadata.image,
					externalUrl: metadata.external_url,
					media: metadata.media,
					creator: account
				}
				for (let i = 0; i < ids.length; i++) {
					if (gnosisAddress) {
						await transferNFT(
							account,
							ids[i],
							gnosisAddress,
							signer,
							customDomain ? customDomainAddress : undefined
						)
						await addDAONFT(
							{
								...nft,
								id: ids[i],
								attributes: {
									numberOfEditions,
									editionNumber: i + 1,
									original: i === 0
								}
							},
							gnosisAddress
						)
					} else {
						await addNFT(
							{
								...nft,
								id: ids[i],
								attributes: {
									numberOfEditions,
									editionNumber: i + 1,
									original: i === 0
								}
							},
							account
						)
					}
				}
				setStage("success")
				if (afterCreate) {
					afterCreate()
				}
			} catch (e) {
				console.error(e)
				toastError("Failed to create NFT")
			}
			setLoading(false)
		} else if (
			stage === "loadExisting" &&
			!isNaN(Number(existingNFTId)) &&
			tokenAddress &&
			account &&
			provider &&
			signer
		) {
			setLoading(true)
			try {
				const isOwner = await checkNFTOwner(account, tokenAddress, existingNFTId, provider)
				if (!isOwner) {
					toastError("You are not the owner!")
					setLoading(false)
					return
				}
				const metadata = await getNFTMetadata(tokenAddress, existingNFTId, provider)
				const nft = {
					id: Number(existingNFTId),
					address: tokenAddress,
					createdDate: new Date().toISOString(),
					name: metadata.name,
					desc: metadata.description,
					thumbnail: metadata.image,
					externalUrl: metadata.external_url,
					media: metadata.media,
					attributes: metadata.attributes,
					creator: account
				}
				if (gnosisAddress) {
					await transferNFT(
						account,
						Number(existingNFTId),
						gnosisAddress,
						signer,
						customDomain ? customDomainAddress : undefined
					)
					await addDAONFT(nft, gnosisAddress)
				} else {
					await addNFT(nft, account)
				}
				if (afterCreate) {
					afterCreate()
				}
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
		(stage === "loadExisting" && !(existingNFTId && existingNFTId))

	return (
		<div className="create-nft">
			{stage === "chooseOption" && (
				<>
					<h2>Enter NFT</h2>
					<p>Step 1: Choose one.</p>
					<div className="create-nft__row">
						<RadioButton
							id="create-new-nft-radio"
							label="Create New NFT"
							checked={!loadExisting}
							onChange={() => {
								setLoadExisting(false)
							}}
						/>
					</div>
					<div className="create-nft__row">
						<RadioButton
							id="load-existing-nft-radio"
							label="Load Existing NFT"
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
							label="Your Custom Domain(s)"
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
							disabled={!customDomain || domainsLoading || domainsError}
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
					<p>Step 3. Input NFT information.</p>
					<MediaUpload
						onUpload={image => {
							setFile(image)
						}}
					/>
					<div className="create-nft__row create-nft__row--no-mg">
						<div className="create-nft__col">
							<label>Title of Piece</label>
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
					<label>NFT Address</label>
					<Input
						borders="all"
						value={tokenAddress}
						onChange={e => {
							setTokenAddress(e.target.value)
						}}
					/>
					<label>NFT ID</label>
					<Input
						borders="all"
						value={existingNFTId}
						onChange={e => {
							setExistingNFTId(e.target.value)
						}}
						number
					/>
				</>
			)}
			{stage === "success" ? (
				<>
					<h2>Success!</h2>
					<p>
						You now have the ability to view and / or delete <br />
						your NFT on the &quot;{gnosisAddress ? "Collection" : "Create / Edit NFTs"}&quot; page
						<br /> of your {gnosisAddress ? "DAO" : "profile"} dashboard.
					</p>
				</>
			) : (
				<Button
					extraClassName={["uploadFile", "loadExisting"].includes(stage) ? "no-margin-top" : ""}
					buttonType="primary"
					onClick={handleSubmit}
					disabled={submitButtonDisabled || loading}
				>
					{stage === "uploadFile" || stage === "loadExisting"
						? loading
							? "Processing..."
							: "Submit"
						: "Continue"}
				</Button>
			)}
		</div>
	)
}

const CreateNFTModal: FunctionComponent<{
	gnosisAddress?: string
	afterCreate?: () => void
}> = ({gnosisAddress, afterCreate}) => {
	const [isOpened, setIsOpened] = useState(false)

	return (
		<>
			<Button
				buttonType={gnosisAddress ? "primary" : "secondary"}
				onClick={() => {
					setIsOpened(true)
				}}
			>
				{gnosisAddress ? "Enter NFT" : "Create / Load NFT"}
			</Button>
			<Modal
				show={isOpened}
				onClose={() => {
					setIsOpened(false)
				}}
			>
				<CreateNFTModalContent gnosisAddress={gnosisAddress} afterCreate={afterCreate} />
			</Modal>
		</>
	)
}

export default CreateNFTModal
