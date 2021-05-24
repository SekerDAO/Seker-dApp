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
	const {signer} = useContext(EthersContext)

	const handleSubmit = async () => {
		if (!(name && symbol && signer) || loading) return
		setLoading(true)
		await deployCustomDomain(name, symbol, signer)
		setName("")
		setSymbol("")
		setLoading(false)
		setIsOpened(false)
		alert("Success!") // TODO
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
			<Modal
				show={isOpened}
				onClose={() => {
					setIsOpened(false)
				}}
			>
				<div className="create-custom-domain">
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
				</div>
			</Modal>
		</>
	)
}

export default CreateCustomDomainModal
