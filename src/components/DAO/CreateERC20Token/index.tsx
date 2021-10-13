import React, {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import Input from "../../Controls/Input"
import Button from "../../Controls/Button"
import "./styles.scss"
import deployERC20Token from "../../../api/ethers/functions/ERC20Token/deployERC20Token"
import EthersContext from "../../../context/EthersContext"
import {AuthContext} from "../../../context/AuthContext"
import {toastError} from "../../Toast"
import {ERC20Token} from "../../../types/ERC20Token"

const CreateERC20Token: FunctionComponent<{
	afterCreate: (token: ERC20Token) => void
}> = ({afterCreate}) => {
	const [name, setName] = useState("")
	const [symbol, setSymbol] = useState("")
	const [totalSupply, setTotalSupply] = useState("")
	const [loading, setLoading] = useState(false)
	const {signer} = useContext(EthersContext)
	const {account} = useContext(AuthContext)

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
			const address = await deployERC20Token(name, symbol, Number(totalSupply), signer)
			afterCreate({name, symbol, address, totalSupply: Number(totalSupply)})
			setLoading(false)
		} catch (e) {
			console.error(e)
			toastError("Failed to create token")
			setLoading(false)
		}
	}

	return (
		<div className="create-erc20-token">
			<h2>Create ERC-20 Token</h2>
			<label htmlFor="create-erc20-name">Token Name</label>
			<Input
				id="create-erc20-name"
				borders="all"
				value={name}
				onChange={e => {
					setName(e.target.value)
				}}
			/>
			<label htmlFor="create-erc20-symbol">Symbol</label>
			<Input
				id="create-erc20-symbol"
				borders="all"
				value={symbol}
				onChange={e => {
					setSymbol(e.target.value)
				}}
			/>
			<label htmlFor="create-erc20-ts">Total Supply</label>
			<Input
				min={0}
				max={100}
				number
				id="create-erc20-ts"
				borders="all"
				value={totalSupply}
				onChange={handleTotalSupplyChange}
			/>
			<Button disabled={!(name && symbol && totalSupply) || loading} onClick={handleSubmit}>
				{loading ? "Processing..." : "Submit"}
			</Button>
		</div>
	)
}

export default CreateERC20Token
