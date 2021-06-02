import React, {ChangeEvent, FunctionComponent, useState} from "react"
import Input from "../../Controls/Input"
import Button from "../../Controls/Button"
import "./styles.scss"

const CreateERC20Token: FunctionComponent<{
	afterCreate?: (name: string, symbol: string, address: string, totalSupply: number) => void
}> = ({afterCreate}) => {
	const [name, setName] = useState("")
	const [symbol, setSymbol] = useState("")
	const [totalSupply, setTotalSupply] = useState("")

	const handleTotalSupplyChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) > 100) {
			setTotalSupply("100")
		} else if (Number(e.target.value) < 0) {
			setTotalSupply("0")
		} else {
			setTotalSupply(String(e.target.value))
		}
	}

	const handleSubmit = () => {
		if (!(name && symbol && totalSupply)) return
		console.log(`Mock create ERC20 token: ${name}, ${symbol}, ${totalSupply}`)
		const address = "0xAA"
		if (afterCreate) {
			afterCreate(name, symbol, address, Number(totalSupply))
		}
	}

	return (
		<div className="create-erc20-token">
			<h2>Create ERC20 Token</h2>
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
			<Button disabled={!(name && symbol && totalSupply)} onClick={handleSubmit}>
				Submit
			</Button>
		</div>
	)
}

export default CreateERC20Token
