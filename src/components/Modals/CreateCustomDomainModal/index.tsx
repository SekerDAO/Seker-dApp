import React, {FunctionComponent, useContext, useState} from "react"
import Button from "../../Controls/Button"
import Modal from "../Modal"
import Input from "../../Controls/Input"
import "./styles.scss"
import EthersContext from "../../../context/EthersContext"
import deployCustomDomain from "../../../api/ethers/functions/customDomain/deployCustomDomain"
import addDomain from "../../../api/firebase/domain/addDomain"
import {AuthContext} from "../../../context/AuthContext"
import {toastError} from "../../Toast"

const CreateCustomDomainModal: FunctionComponent = () => {
	const [isOpened, setIsOpened] = useState(false)
	const [name, setName] = useState("")
	const [symbol, setSymbol] = useState("")
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const {signer} = useContext(EthersContext)
	const {account} = useContext(AuthContext)

	const handleSubmit = async () => {
		if (!(name && symbol && signer && account) || loading) return
		setLoading(true)
		try {
			const domainAddress = await deployCustomDomain(name, symbol, signer)
			await addDomain(name, symbol, domainAddress, account)
			setName("")
			setSymbol("")
			setSuccess(true)
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
				Create A Custom Domain
			</Button>
			<Modal show={isOpened} onClose={handleClose}>
				<div className="create-custom-domain">
					{success ? (
						<>
							<h2>Success!</h2>
							<p>
								You now have an immutable, unique, and versatile
								<br />
								domain to host your newly created NFTs. To create your
								<br />
								first NFT, click on the &quot;Create / Load NFT&quot; button at the
								<br />
								top of your profile dashboard.
							</p>
						</>
					) : (
						<>
							<h2>Create A Custom Domain</h2>
							<label htmlFor="create-custom-domain-name">Domain Name</label>
							<Input
								id="create-custom-domain-name"
								borders="all"
								value={name}
								onChange={e => {
									setName(e.target.value)
								}}
							/>
							<label htmlFor="create-custom-domain-symbol">Symbol</label>
							<Input
								id="create-custom-domain-symbol"
								borders="all"
								value={symbol}
								onChange={e => {
									setSymbol(e.target.value)
								}}
							/>
							<Button
								disabled={!(name && symbol) || loading}
								buttonType="primary"
								onClick={handleSubmit}
							>
								{loading ? "Processing..." : "Submit"}
							</Button>
						</>
					)}
				</div>
			</Modal>
		</>
	)
}

export default CreateCustomDomainModal
