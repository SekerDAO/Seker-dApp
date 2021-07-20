import React, {FunctionComponent, useState} from "react"
import Input from "../../Controls/Input"
import Select from "../../Controls/Select"
import Button from "../../Controls/Button"

const CreateZoraAuction: FunctionComponent<{
	gnosisAddress: string
}> = () => {
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [nftTokenId, setNftTokenId] = useState("")
	const [reservePrice, setReservePrice] = useState("")
	const [customCurrency, setCustomCurrency] = useState<"" | "ETH" | "custom">("")
	const [currencyToken, setCurrencyToken] = useState("")
	const [curatorAddress, setCuratorAddress] = useState("")
	const [curatorFee, setCuratorFee] = useState("")
	const [duration, setDuration] = useState("")

	return (
		<>
			<label htmlFor="create-zora-auction-title">Title</label>
			<Input
				borders="all"
				value={title}
				id="create-zora-auction-title"
				onChange={e => {
					setTitle(e.target.value)
				}}
			/>
			<label htmlFor="create-zora-auction-desc">Description</label>
			<Input
				borders="all"
				value={description}
				id="create-zora-auction-desc"
				onChange={e => {
					setDescription(e.target.value)
				}}
			/>
			<label htmlFor="create-zora-auction-nft-token">NFT Token ID</label>
			<Input
				borders="all"
				value={nftTokenId}
				id="create-zora-auction-nft-token"
				onChange={e => {
					setNftTokenId(e.target.value)
				}}
			/>
			<label htmlFor="create-zora-auction-price">Reserve Price</label>
			<Input
				borders="all"
				value={reservePrice}
				id="create-zora-auction-price"
				onChange={e => {
					setReservePrice(e.target.value)
				}}
			/>
			<label htmlFor="create-zora-auction-custom-currency">Auction Currency</label>
			<Select
				fullWidth
				id="create-zora-auction-custom-currency"
				options={[
					{name: "Choose One", value: ""},
					{name: "ETH", value: "ETH"},
					{name: "Custom Currency", value: "custom"}
				]}
				onChange={e => {
					setCustomCurrency(e.target.value as "")
				}}
				value={customCurrency}
			/>
			{customCurrency === "custom" && (
				<>
					<label htmlFor="create-zora-auction-currency-id">Custom Currency Token ID</label>
					<Input
						borders="all"
						value={currencyToken}
						id="create-zora-auction-currency-id"
						onChange={e => {
							setCurrencyToken(e.target.value)
						}}
					/>
				</>
			)}
			<div className="create-dao-proposal__row">
				<div className="create-dao-proposal__col">
					<label htmlFor="create-zora-auction-curator-address">Curator&apos;s Address</label>
					<Input
						id="create-zora-auction-curator-address"
						borders="all"
						value={curatorAddress}
						onChange={e => {
							setCuratorAddress(e.target.value)
						}}
					/>
				</div>
				<div className="create-dao-proposal__col">
					<label htmlFor="create-zora-auction-curator-fee">Curator&apos;s Fee (%)</label>
					<Input
						id="create-zora-auction-curator-fee"
						borders="all"
						value={curatorFee}
						onChange={e => {
							setCuratorFee(e.target.value)
						}}
					/>
				</div>
			</div>
			<label htmlFor="create-zora-auction-curator-duration">Duration</label>
			<Input
				id="create-zora-auction-curator-duration"
				borders="all"
				value={duration}
				onChange={e => {
					setDuration(e.target.value)
				}}
			/>
			<Button>Create Proposal</Button>
		</>
	)
}

export default CreateZoraAuction
