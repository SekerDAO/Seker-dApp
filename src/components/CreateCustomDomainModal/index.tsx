import React, {FunctionComponent, useContext, useState} from "react"
import Button from "../Controls/Button"
import Modal from "../Modal"
import Input from "../Controls/Input"
import "./styles.scss"
import EthersContext from "../../customHooks/useEthers"
import deployCustomDomain from "../../api/functions/deployCustomDomain"

const CreateCustomDomainModal: FunctionComponent = () => {
	const [isOpened, setIsOpened] = useState(false)
	const [name, setName] = useState("")
	const [symbol, setSymbol] = useState("")
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)
	const {signer} = useContext(EthersContext)

	const handleSubmit = async () => {
		if (!(name && symbol && signer) || loading) return
		setLoading(true)
		await deployCustomDomain(name, symbol, signer)
		setName("")
		setSymbol("")
		setLoading(false)
		setSuccess(true)
	}

	const handleClose = () => {
		setIsOpened(false)
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
								top of your user dashboard.
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
							<Button disabled={!(name && symbol) || loading} buttonType="primary" onClick={handleSubmit}>
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
