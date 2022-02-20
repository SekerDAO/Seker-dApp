import {isAddress} from "@ethersproject/address"
import {FunctionComponent, useState, useContext, ChangeEvent} from "react"
import checkNFTOwner from "../../api/ethers/functions/NFT/checkNFTOwner"
import createNFT from "../../api/ethers/functions/NFT/createNFT"
import getNFTMetadata from "../../api/ethers/functions/NFT/getNFTMetadata"
import transferNFT from "../../api/ethers/functions/NFT/transferNFT"
import addDaoNft from "../../api/firebase/NFT/addDaoNft"
import addNft from "../../api/firebase/NFT/addNft"
import uploadMedia from "../../api/ipfs/uploadMedia"
import config from "../../config"
import {AuthContext} from "../../context/AuthContext"
import {ProviderContext} from "../../context/ProviderContext"
import useCheckNetwork from "../../hooks/useCheckNetwork"
import {Domain} from "../../types/user"
import Button from "../Controls/Button"
import Input from "../Controls/Input"
import MediaUpload from "../Controls/MediaUpload"
import RadioButton from "../Controls/RadioButton"
import Select from "../Controls/Select"
import Textarea from "../Controls/Textarea"
import ConnectWalletPlaceholder from "../UI/ConnectWalletPlaceholder"
import {toastError} from "../UI/Toast"
import "./styles.scss"

type CreateNFTStage = "chooseOption" | "chooseDomain" | "uploadFile" | "loadExisting" | "success"

const CreateNFTForm: FunctionComponent<{
	gnosisAddress?: string
	afterCreate?: () => void
	domains: Domain[]
}> = ({gnosisAddress, afterCreate, domains}) => {
	const [loading, setLoading] = useState(false)
	const [stage, setStage] = useState<CreateNFTStage>("chooseOption")
	const [loadExisting, setLoadExisting] = useState(false)
	const [customDomain, setCustomDomain] = useState(false)
	const [customDomainAddress, setCustomDomainAddress] = useState("")
	const [file, setFile] = useState<File | null>(null)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [numberOfEditions, setNumberOfEditions] = useState("")
	const [numberOfEditionsValidation, setNumberOfEditionsValidation] = useState<string | null>(null)
	const [tokenAddress, setTokenAddress] = useState("")
	const [tokenAddressValidation, setTokenAddressValidation] = useState<string | null>(null)
	const [existingNftId, setExistingNftId] = useState("")
	const [existingNftIdValidation, setExisingNftIdValidation] = useState<string | null>(null)
	const {provider} = useContext(ProviderContext)
	const {account, signer, connected} = useContext(AuthContext)

	const checkedCreateNft = useCheckNetwork(createNFT)
	const checkedTransferNft = useCheckNetwork(transferNFT)

	if (!connected) {
		return <ConnectWalletPlaceholder />
	}

	const handleNumberOfEditionsChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) > 50) {
			setNumberOfEditions("50")
		} else {
			setNumberOfEditions(e.target.value)
		}
		if (isNaN(Number(e.target.value))) {
			setNumberOfEditionsValidation("Please enter a number")
		} else if (e.target.value && Number(e.target.value) < 1) {
			setNumberOfEditionsValidation("Should be 1 or larger")
		} else if (Number(e.target.value) !== Math.round(Number(e.target.value))) {
			setNumberOfEditionsValidation("Should be integer")
		} else {
			setNumberOfEditionsValidation(null)
		}
	}

	const handleTokenAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
		setTokenAddress(e.target.value)
		setTokenAddressValidation(
			!e.target.value || isAddress(e.target.value) ? null : "Not a valid address"
		)
	}

	const handleExistingNftIdChange = (e: ChangeEvent<HTMLInputElement>) => {
		setExistingNftId(e.target.value)
		if (isNaN(Number(e.target.value))) {
			setExisingNftIdValidation("Please enter a number")
		} else if (e.target.value && Number(e.target.value) < 1) {
			setExisingNftIdValidation("Should be 1 or larger")
		} else if (Number(e.target.value) !== Math.round(Number(e.target.value))) {
			setExisingNftIdValidation("Should be integer")
		} else {
			setExisingNftIdValidation(null)
		}
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
		} else if (
			stage === "uploadFile" &&
			file &&
			title &&
			numberOfEditions &&
			!numberOfEditionsValidation &&
			signer &&
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
				const ids = await checkedCreateNft(
					hashes,
					Number(numberOfEditions),
					signer,
					provider,
					customDomainAddress || undefined
				)
				const nft = {
					address: customDomain ? customDomainAddress : config.DOMAIN_ADDRESS,
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
						await checkedTransferNft(
							account,
							ids[i],
							gnosisAddress,
							signer,
							customDomain ? customDomainAddress : undefined
						)
						await addDaoNft(
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
						await addNft({
							...nft,
							id: ids[i],
							attributes: {
								numberOfEditions,
								editionNumber: i + 1,
								original: i === 0
							}
						})
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
			!isNaN(Number(existingNftId)) &&
			tokenAddress &&
			account &&
			provider &&
			signer
		) {
			setLoading(true)
			try {
				const isOwner = await checkNFTOwner(account, tokenAddress, existingNftId, provider)
				if (!isOwner) {
					toastError("You are not the owner!")
					setLoading(false)
					return
				}
				const metadata = await getNFTMetadata(tokenAddress, existingNftId, provider)
				const nft = {
					id: Number(existingNftId),
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
						Number(existingNftId),
						gnosisAddress,
						signer,
						customDomain ? customDomainAddress : undefined
					)
					await addDaoNft(nft, gnosisAddress)
				} else {
					await addNft(nft)
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
		(stage === "uploadFile" &&
			!(file && title && numberOfEditions && !numberOfEditionsValidation)) ||
		(stage === "loadExisting" &&
			!(tokenAddress && !tokenAddressValidation && existingNftId && !existingNftIdValidation))

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
						<Select<string>
							placeholder="Select Domain"
							value={customDomainAddress}
							options={domains.map(domain => ({name: domain.name, value: domain.address}))}
							disabled={!customDomain}
							onChange={newCustomDomain => {
								setCustomDomainAddress(newCustomDomain)
							}}
							fullWidth
						/>
					</div>
					<div className="create-nft__row">
						<RadioButton
							label="Seker Domain"
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
								onChange={handleNumberOfEditionsChange}
								validation={numberOfEditionsValidation}
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
						onChange={handleTokenAddressChange}
						validation={tokenAddressValidation}
					/>
					<label>NFT ID</label>
					<Input
						borders="all"
						value={existingNftId}
						onChange={handleExistingNftIdChange}
						validation={existingNftIdValidation}
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

export default CreateNFTForm
