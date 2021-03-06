import {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import deployERC20Token from "../../../api/ethers/functions/ERC20Token/deployERC20Token"
import config from "../../../config"
import {AuthContext} from "../../../context/AuthContext"
import useCheckNetwork from "../../../hooks/useCheckNetwork"
import {ERC20Token} from "../../../types/ERC20Token"
import Button from "../../Controls/Button"
import Input from "../../Controls/Input"
import {toastError} from "../../UI/Toast"
import Modal from "../Modal"
import "./styles.scss"

const CreateERC20TokenModal: FunctionComponent<{
	onSubmit: (token: ERC20Token) => void
	onClose: () => void
	sideChain: boolean
}> = ({onSubmit, onClose, sideChain}) => {
	const [name, setName] = useState("")
	const [symbol, setSymbol] = useState("")
	const [totalSupply, setTotalSupply] = useState("")
	const [loading, setLoading] = useState(false)
	const {account, signer} = useContext(AuthContext)

	const checkedDeployToken = useCheckNetwork(
		deployERC20Token,
		sideChain ? config.SIDE_CHAIN_ID : config.CHAIN_ID
	)

	const handleTotalSupplyChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setTotalSupply("0")
		} else {
			setTotalSupply(String(e.target.value))
		}
	}

	const handleSubmit = async () => {
		if (!(name && symbol && totalSupply && signer && account)) return
		setLoading(true)
		try {
			const address = await checkedDeployToken(name, symbol, Number(totalSupply), signer)
			onSubmit({name, symbol, address, totalSupply: Number(totalSupply)})
			setLoading(false)
		} catch (e) {
			console.error(e)
			toastError("Failed to create token")
			setLoading(false)
		}
	}

	return (
		<Modal show onClose={onClose} zIndex={6}>
			<div className="create-erc20-token">
				<h2>Create ERC-20 Token</h2>
				<label htmlFor="create-erc20-name">Token Name</label>
				<Input
					id="create-erc20-name"
					value={name}
					onChange={e => {
						setName(e.target.value)
					}}
				/>
				<label htmlFor="create-erc20-symbol">Symbol</label>
				<Input
					id="create-erc20-symbol"
					value={symbol}
					onChange={e => {
						setSymbol(e.target.value)
					}}
				/>
				<label htmlFor="create-erc20-ts">Total Supply (18 decimal token)</label>
				<Input
					min={0}
					number
					id="create-erc20-ts"
					value={totalSupply}
					onChange={handleTotalSupplyChange}
					placeholder="Value in Ethers"
				/>
				<Button disabled={!(name && symbol && totalSupply) || loading} onClick={handleSubmit}>
					{loading ? "Processing..." : "Submit"}
				</Button>
			</div>
		</Modal>
	)
}

export default CreateERC20TokenModal
