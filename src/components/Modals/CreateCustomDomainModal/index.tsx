import {FunctionComponent, useContext, useState} from "react"
import deployCustomDomain from "../../../api/ethers/functions/customDomain/deployCustomDomain"
import addDomain from "../../../api/firebase/user/addDomain"
import {AuthContext} from "../../../context/AuthContext"
import useCheckNetwork from "../../../hooks/useCheckNetwork"
import Button from "../../Controls/Button"
import Input from "../../Controls/Input"
import {toastError} from "../../UI/Toast"
import Modal from "../Modal"
import "./styles.scss"

const CreateCustomDomainModal: FunctionComponent<{
	afterCreate: () => void
}> = ({afterCreate}) => {
	const [isOpened, setIsOpened] = useState(false)
	const [name, setName] = useState("")
	const [symbol, setSymbol] = useState("")
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const {signer} = useContext(AuthContext)

	const checkedDeployCustomDomain = useCheckNetwork(deployCustomDomain)

	const handleSubmit = async () => {
		if (!(name && symbol && signer) || loading) return
		setLoading(true)
		try {
			const domainAddress = await checkedDeployCustomDomain(name, symbol, signer)
			await addDomain({name, symbol, address: domainAddress})
			setName("")
			setSymbol("")
			setSuccess(true)
			afterCreate()
		} catch (e) {
			console.error(e)
			toastError("Failed to create domain")
		}
		setLoading(false)
	}

	const handleClose = () => {
		setIsOpened(false)
		setName("")
		setSymbol("")
		setLoading(false)
		setSuccess(false)
	}

	return (
		<>
			<Button
				buttonType="primary"
				onClick={() => {
					setIsOpened(true)
				}}
			>
				Create a Custom Domain
			</Button>
			<Modal
				show={isOpened}
				onClose={handleClose}
				title={success ? "Success!" : "Create a Custom Domain"}
				warningMessages={
					success
						? [
								`This request will incur a gas fee. If you would like to proceed, please click "Submit" below.`
						  ]
						: undefined
				}
				onSubmit={handleSubmit}
				submitButtonDisabled={!(name && symbol) || loading}
				submitButtonText={success ? undefined : loading ? "Processing..." : "Submit"}
			>
				<div className="create-custom-domain">
					{success ? (
						<p>
							{`You now have an immutable, unique, and versatile domain to host your newly created
							NFTs. To create your first NFT, click on the "Create / Load NFT" button at the top of
							your profile dashboard.`}
						</p>
					) : (
						<>
							<label htmlFor="create-custom-domain-name">Domain Name</label>
							<Input
								id="create-custom-domain-name"
								value={name}
								onChange={e => {
									setName(e.target.value)
								}}
							/>
							<label htmlFor="create-custom-domain-symbol">Symbol</label>
							<Input
								id="create-custom-domain-symbol"
								value={symbol}
								onChange={e => {
									setSymbol(e.target.value)
								}}
							/>
						</>
					)}
				</div>
			</Modal>
		</>
	)
}

export default CreateCustomDomainModal
