import {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import Input from "../../Controls/Input"
import Select from "../../Controls/Select"
import Button from "../../Controls/Button"
import useNFTs from "../../../hooks/getters/useNFTs"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import Loader from "../../UI/Loader"
import {NFT} from "../../../types/NFT"
import {toastError, toastSuccess} from "../../UI/Toast"
import {AuthContext} from "../../../context/AuthContext"
import EthersContext from "../../../context/EthersContext"
import currencies from "../../../constants/currencies"

const CreateAuction: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	title: string
	description: string
	afterSubmit: () => void
}> = ({gnosisAddress, gnosisVotingThreshold, title, description, afterSubmit}) => {
	const {account} = useContext(AuthContext)
	const {signer} = useContext(EthersContext)
	const {NFTs, loading, error} = useNFTs({
		user: gnosisAddress,
		limit: 0,
		after: null,
		sort: "nameAsc"
	})
	const [processing, setProcessing] = useState(false)
	const [nft, setNft] = useState<NFT | null>(null)
	const [reservePrice, setReservePrice] = useState("")
	const [currencySymbol, setCurrencySymbol] = useState("")
	const [currencyAddress, setCurrencyAddress] = useState("")
	const [curatorAddress, setCuratorAddress] = useState(gnosisAddress)
	const [curatorFeePercentage, setCuratorFeePercentage] = useState("")
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
			setCuratorFeePercentage("0")
		} else {
			setCuratorFeePercentage(e.target.value)
		}
	}

	const handleDurationChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setDuration("0")
		} else {
			setDuration(e.target.value)
		}
	}

	const handleNFTChange = (nftId: number) => {
		const snapshot = NFTs.data.find(s => s.data().id === nftId)
		if (snapshot) {
			setNft(snapshot.data())
		} else {
			setNft(null)
		}
	}

	const handleCurrencyChange = (newCurrencySymbol: string) => {
		setCurrencySymbol(newCurrencySymbol)
		setCurrencyAddress(currencies.find(c => c.symbol === newCurrencySymbol)?.address ?? "")
	}

	const handleSubmit = async () => {
		if (!(account && nft && signer && currencySymbol)) return
		setProcessing(true)
		try {
			console.log("TODO")
			// await addProposal({
			// 	type: "createAuction",
			// 	module: "gnosis",
			// 	userAddress: account,
			// 	gnosisAddress,
			// 	state,
			// 	title,
			// 	...(description ? {description} : {}),
			// 	nftId: nft.id,
			// 	nftAddress: nft.address,
			// 	duration: Number(duration),
			// 	reservePrice: Number(reservePrice),
			// 	curatorAddress,
			// 	curatorFeePercentage: Number(curatorFeePercentage),
			// 	auctionCurrencySymbol: currencySymbol,
			// 	auctionCurrencyAddress: currencyAddress,
			// 	signatures: approveSignatures,
			// 	signaturesStep2: createSignatures
			// })
			setReservePrice("")
			setCurrencySymbol("")
			setCurrencyAddress("")
			setCuratorAddress(gnosisAddress)
			setCuratorFeePercentage("")
			setDuration("")
			afterSubmit()
			toastSuccess("Proposal successfully created")
		} catch (e) {
			console.error(e)
			toastError("Failed to create Auction proposal")
		}
		setProcessing(false)
	}

	const submitButtonDisabled =
		!(
			title &&
			nft &&
			reservePrice &&
			(currencySymbol === "custom" ? currencyAddress : currencySymbol) &&
			curatorAddress &&
			curatorFeePercentage &&
			duration
		) ||
		isNaN(Number(reservePrice)) ||
		isNaN(Number(curatorFeePercentage)) ||
		isNaN(Number(duration))

	return (
		<>
			<label htmlFor="create-auction-nft-token">Select NFT</label>
			<Select<number>
				fullWidth
				id="create-auction-custom-currency"
				placeholder="Choose One"
				options={[
					...NFTs.data
						.filter((d, index) => !NFTs.nftsAreOnAuctions[index])
						.map(s => {
							const {name, id} = s.data()
							return {name, value: id}
						})
				]}
				onChange={handleNFTChange}
				value={nft?.id}
			/>
			<label htmlFor="create-auction-price">Reserve Price</label>
			<Input
				number
				min={0}
				borders="all"
				value={reservePrice}
				id="create-auction-price"
				onChange={handlePriceChange}
			/>
			<label htmlFor="create-auction-custom-currency">Auction Currency</label>
			<Select<string>
				fullWidth
				id="create-auction-custom-currency"
				placeholder="Choose One"
				options={[
					...currencies.map(cur => ({name: cur.symbol, value: cur.symbol})),
					{name: "Custom Currency", value: "custom"}
				]}
				onChange={handleCurrencyChange}
				value={currencySymbol}
			/>
			{currencySymbol === "custom" && (
				<>
					<label htmlFor="create-auction-currency-id">Custom Currency Token Address</label>
					<Input
						borders="all"
						value={currencyAddress}
						id="create-auction-currency-id"
						onChange={e => {
							setCurrencyAddress(e.target.value)
						}}
					/>
				</>
			)}
			<div className="create-dao-proposal__row">
				<div className="create-dao-proposal__col">
					<label htmlFor="create-auction-curator-address">Curator&apos;s Address</label>
					<Input
						id="create-auction-curator-address"
						borders="all"
						value={curatorAddress}
						onChange={e => {
							setCuratorAddress(e.target.value)
						}}
					/>
				</div>
				<div className="create-dao-proposal__col">
					<label htmlFor="create-auction-curator-fee">Curator&apos;s Fee (%)</label>
					<Input
						number
						min={0}
						id="create-auction-curator-fee"
						borders="all"
						value={curatorFeePercentage}
						onChange={handleFeeChange}
					/>
				</div>
			</div>
			<label htmlFor="create-auction-curator-duration">Duration (Hours)</label>
			<Input
				number
				min={0}
				id="create-auction-curator-duration"
				borders="all"
				value={duration}
				onChange={handleDurationChange}
			/>
			<Button
				disabled={submitButtonDisabled || processing}
				onClick={handleSubmit}
				extraClassName="create-dao-proposal__submit-button"
			>
				{processing ? "Processing..." : "Create Proposal"}
			</Button>
		</>
	)
}

export default CreateAuction
