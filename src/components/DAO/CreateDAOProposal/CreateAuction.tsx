import React, {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import Input from "../../Controls/Input"
import Select from "../../Controls/Select"
import Button from "../../Controls/Button"
import useNFTs from "../../../customHooks/getters/useNFTs"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import Loader from "../../Loader"
import {NFT} from "../../../types/NFT"
import {toastError, toastSuccess} from "../../Toast"
import addProposal from "../../../api/firebase/proposal/addProposal"
import {AuthContext} from "../../../context/AuthContext"
import {SafeSignature} from "../../../api/ethers/functions/gnosisSafe/safeUtils"
import {
	executeCreateAuction,
	signCreateAuction
} from "../../../api/ethers/functions/auction/createAuction"
import EthersContext from "../../../context/EthersContext"
import {
	executeApproveNFTForAuction,
	signApproveNFTForAuction
} from "../../../api/ethers/functions/auction/approveNFTForAuction"
import currencies from "../../../constants/currencies"
import addAuction from "../../../api/firebase/auction/addAuction"
import {ProposalState} from "../../../types/proposal"

const CreateAuction: FunctionComponent<{
	gnosisAddress: string
	isAdmin: boolean
	gnosisVotingThreshold: number
}> = ({gnosisAddress, isAdmin, gnosisVotingThreshold}) => {
	const {account} = useContext(AuthContext)
	const {signer} = useContext(EthersContext)
	const {NFTs, loading, error} = useNFTs({
		user: gnosisAddress,
		limit: 0,
		after: null,
		sort: "nameAsc"
	})
	const [processing, setProcessing] = useState(false)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
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

	const handleNFTChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const snapshot = NFTs.data.find(s => s.data().id === Number(e.target.value))
		if (snapshot) {
			setNft(snapshot.data())
		} else {
			setNft(null)
		}
	}

	const handleCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setCurrencySymbol(e.target.value)
		setCurrencyAddress(currencies.find(c => c.symbol === e.target.value)?.address ?? "")
	}

	const handleSubmit = async () => {
		if (!(account && nft && signer && currencySymbol)) return
		setProcessing(true)
		try {
			const approveSignatures: SafeSignature[] = []
			const createSignatures: SafeSignature[] = []
			const signingArgs = [
				gnosisAddress,
				nft.id,
				nft.address,
				Number(duration),
				Number(reservePrice),
				curatorAddress,
				Number(curatorFeePercentage),
				currencyAddress,
				signer
			] as const
			let state: ProposalState = "active"
			if (isAdmin) {
				const approveSignature = await signApproveNFTForAuction(...signingArgs)
				const createSignature = await signCreateAuction(...signingArgs)
				approveSignatures.push(approveSignature)
				createSignatures.push(createSignature)
				if (gnosisVotingThreshold === 1) {
					await executeApproveNFTForAuction(
						gnosisAddress,
						nft.id,
						nft.address,
						approveSignatures,
						signer
					)
					const id = await executeCreateAuction(
						gnosisAddress,
						nft.id,
						nft.address,
						Number(duration),
						Number(reservePrice),
						curatorAddress,
						Number(curatorFeePercentage),
						currencyAddress,
						createSignatures,
						signer
					)
					await addAuction({
						id,
						gnosisAddress,
						nftId: nft.id,
						nftAddress: nft.address,
						nftName: nft.name,
						duration: Number(duration),
						reservePrice: Number(reservePrice),
						curatorAddress,
						curatorFeePercentage: Number(curatorFeePercentage),
						tokenSymbol: currencySymbol,
						tokenAddress: currencyAddress
					})
					state = "executed"
				}
			}
			await addProposal({
				type: "createAuction",
				module: "gnosis",
				userAddress: account,
				gnosisAddress,
				state,
				title,
				...(description ? {description} : {}),
				nftId: nft.id,
				nftAddress: nft.address,
				duration: Number(duration),
				reservePrice: Number(reservePrice),
				curatorAddress,
				curatorFeePercentage: Number(curatorFeePercentage),
				auctionCurrencySymbol: currencySymbol,
				auctionCurrencyAddress: currencyAddress,
				signatures: approveSignatures,
				signaturesStep2: createSignatures
			})
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
			<label htmlFor="create-auction-title">Title</label>
			<Input
				borders="all"
				value={title}
				id="create-auction-title"
				onChange={e => {
					setTitle(e.target.value)
				}}
			/>
			<label htmlFor="create-auction-desc">Description</label>
			<Input
				borders="all"
				value={description}
				id="create-auction-desc"
				onChange={e => {
					setDescription(e.target.value)
				}}
			/>
			<label htmlFor="create-auction-nft-token">Select NFT</label>
			<Select
				fullWidth
				id="create-auction-custom-currency"
				options={[
					{name: "Choose One", value: ""},
					...NFTs.data
						.filter((d, index) => !NFTs.nftsAreOnAuctions[index])
						.map(s => {
							const {name, id} = s.data()
							return {name, value: id}
						})
				]}
				onChange={handleNFTChange}
				value={nft?.id ?? ""}
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
			<Select
				fullWidth
				id="create-auction-custom-currency"
				options={[
					{name: "Choose One", value: ""},
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
			<Button disabled={submitButtonDisabled || processing} onClick={handleSubmit}>
				{processing ? "Processing..." : "Create Proposal"}
			</Button>
		</>
	)
}

export default CreateAuction
