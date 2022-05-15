import {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import {
	executeApproveNFTForAuction,
	signApproveNFTForAuction
} from "../../../../api/ethers/functions/auction/approveNFTForAuction"
import {
	executeCreateAuction,
	signCreateAuction
} from "../../../../api/ethers/functions/auction/createAuction"
import addSafeProposal from "../../../../api/firebase/safeProposal/addSafeProposal"
import currencies from "../../../../constants/currencies"
import {AuthContext} from "../../../../context/AuthContext"
import useNFTs from "../../../../hooks/getters/useNFTs"
import {NFT} from "../../../../types/NFT"
import Button from "../../../Controls/Button"
import Input from "../../../Controls/Input"
import Select from "../../../Controls/Select"
import ErrorPlaceholder from "../../../UI/ErrorPlaceholder"
import Loader from "../../../UI/Skeleton"
import {toastError, toastSuccess} from "../../../UI/Toast"

const CreateAuction: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	title: string
	description: string
	afterSubmit: () => void
}> = ({gnosisAddress, gnosisVotingThreshold, title, description, afterSubmit}) => {
	const {account, signer} = useContext(AuthContext)
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
			const [approveSignature, nonce] = await signApproveNFTForAuction(
				gnosisAddress,
				nft.id,
				nft.address,
				signer
			)
			const [createSignature] = await signCreateAuction(
				gnosisAddress,
				nft.id,
				nft.address,
				Number(duration),
				Number(reservePrice),
				currencyAddress,
				signer
			)
			if (gnosisVotingThreshold === 1) {
				await executeApproveNFTForAuction(
					gnosisAddress,
					nft.id,
					nft.address,
					[approveSignature],
					signer
				)
				await executeCreateAuction(
					gnosisAddress,
					nft.id,
					nft.address,
					Number(duration),
					Number(reservePrice),
					currencyAddress,
					[createSignature],
					signer
				)
			}
			await addSafeProposal({
				type: "createAuction",
				gnosisAddress,
				state: gnosisVotingThreshold === 1 ? "executed" : "active",
				title,
				...(description ? {description} : {}),
				nftId: nft.id,
				nftAddress: nft.address,
				duration: Number(duration),
				reservePrice: Number(reservePrice),
				auctionCurrencySymbol: currencySymbol,
				auctionCurrencyAddress: currencyAddress,
				signatures: [approveSignature],
				signaturesStep2: [createSignature],
				nonce
			})
			setReservePrice("")
			setCurrencySymbol("")
			setCurrencyAddress("")
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
			duration
		) ||
		isNaN(Number(reservePrice)) ||
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
						value={currencyAddress}
						id="create-auction-currency-id"
						onChange={e => {
							setCurrencyAddress(e.target.value)
						}}
					/>
				</>
			)}
			<label htmlFor="create-auction-curator-duration">Duration (Hours)</label>
			<Input
				number
				min={0}
				id="create-auction-curator-duration"
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
