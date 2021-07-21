import React, {ChangeEvent, FunctionComponent, useState} from "react"
import Input from "../../Controls/Input"
import Select from "../../Controls/Select"
import Button from "../../Controls/Button"
import useNFTs from "../../../customHooks/getters/useNFTs"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import Loader from "../../Loader"
import {NFT} from "../../../types/NFT"
import {toastError} from "../../Toast"

const CreateZoraAuction: FunctionComponent<{
	gnosisAddress: string
}> = ({gnosisAddress}) => {
	const {NFTs, loading, error} = useNFTs({user: gnosisAddress, limit: 0, after: null})
	const [processing, setProcessing] = useState(false)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [nft, setNft] = useState<NFT | null>(null)
	const [reservePrice, setReservePrice] = useState("")
	const [customCurrency, setCustomCurrency] = useState<"" | "ETH" | "custom">("")
	const [currencyToken, setCurrencyToken] = useState("")
	const [curatorAddress, setCuratorAddress] = useState("")
	const [curatorFee, setCuratorFee] = useState("")
	const [duration, setDuration] = useState("")

	if (error) return <ErrorPlaceholder />
	if (!NFTs || loading) return <Loader />

	const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setReservePrice("0")
		} else {
			setReservePrice(e.target.value)
		}
	}

	const handleFeeChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setCuratorFee("0")
		} else {
			setCuratorFee(e.target.value)
		}
	}

	const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setDuration("0")
		} else {
			setDuration(e.target.value)
		}
	}

	const handleSubmit = async () => {
		setProcessing(true)
		try {
			console.log("TODO: mock create")
		} catch (e) {
			console.error(e)
			toastError("Failed to create Zora Auction proposal")
		}
		setProcessing(false)
	}

	const submitButtonDisabled =
		!(
			title &&
			nft &&
			reservePrice &&
			(customCurrency === "ETH" || (customCurrency === "custom" && currencyToken)) &&
			curatorAddress &&
			curatorFee &&
			duration
		) ||
		isNaN(Number(reservePrice)) ||
		isNaN(Number(curatorFee)) ||
		isNaN(Number(duration))

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
			<label htmlFor="create-zora-auction-nft-token">Select NFT</label>
			<Select
				fullWidth
				id="create-zora-auction-custom-currency"
				options={[
					{name: "Choose One", value: ""},
					...NFTs.data.map(s => {
						const {name, id} = s.data()
						return {name, value: id}
					})
				]}
				onChange={e => {
					const shapshot = NFTs.data.find(s => s.data().id === Number(e.target.value))
					if (shapshot) {
						setNft(shapshot.data())
					} else {
						setNft(null)
					}
				}}
				value={nft?.id ?? ""}
			/>
			<label htmlFor="create-zora-auction-price">Reserve Price</label>
			<Input
				number
				min={0}
				borders="all"
				value={reservePrice}
				id="create-zora-auction-price"
				onChange={handlePriceChange}
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
						number
						min={0}
						id="create-zora-auction-curator-fee"
						borders="all"
						value={curatorFee}
						onChange={handleFeeChange}
					/>
				</div>
			</div>
			<label htmlFor="create-zora-auction-curator-duration">Duration (Hours)</label>
			<Input
				number
				min={0}
				id="create-zora-auction-curator-duration"
				borders="all"
				value={duration}
				onChange={handleDurationChange}
			/>
			<Button disabled={submitButtonDisabled || processing} onClick={handleSubmit}>
				{processing ? "Processing..." : "Create Proposal"}
			</Button>
		</>
	)
}

export default CreateZoraAuction
