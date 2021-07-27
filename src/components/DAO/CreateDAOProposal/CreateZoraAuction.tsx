import React, {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import Input from "../../Controls/Input"
import Select from "../../Controls/Select"
import Button from "../../Controls/Button"
import useNFTs from "../../../customHooks/getters/useNFTs"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import Loader from "../../Loader"
import {NFT} from "../../../types/NFT"
import {toastError} from "../../Toast"
import addProposal from "../../../api/firebase/proposal/addProposal"
import {AuthContext} from "../../../context/AuthContext"
import {SafeSignature} from "../../../api/ethers/functions/gnosisSafe/safeUtils"
import {
	executeCreateZoraAuction,
	signCreateZoraAuction
} from "../../../api/ethers/functions/zoraAuction/createZoraAuction"
import EthersContext from "../../../context/EthersContext"

const CreateZoraAuction: FunctionComponent<{
	gnosisAddress: string
	isAdmin: boolean
	gnosisVotingThreshold: number
}> = ({gnosisAddress, isAdmin, gnosisVotingThreshold}) => {
	const {account} = useContext(AuthContext)
	const {signer} = useContext(EthersContext)
	const {NFTs, loading, error} = useNFTs({user: gnosisAddress, limit: 0, after: null})
	const [processing, setProcessing] = useState(false)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [nft, setNft] = useState<NFT | null>(null)
	const [reservePrice, setReservePrice] = useState("")
	const [customCurrency, setCustomCurrency] = useState<"" | "ETH" | "custom">("")
	const [currencyToken, setCurrencyToken] = useState("")
	const [curatorAddress, setCuratorAddress] = useState("")
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

	const handleSubmit = async () => {
		if (!(account && nft && signer)) return
		setProcessing(true)
		try {
			const signatures: SafeSignature[] = []
			if (isAdmin) {
				const signature = await signCreateZoraAuction(
					gnosisAddress,
					nft.id,
					nft.address,
					Number(duration),
					Number(reservePrice),
					curatorAddress,
					Number(curatorFeePercentage),
					customCurrency === "custom" ? currencyToken : "ETH",
					signer
				)
				signatures.push(signature)
				if (gnosisVotingThreshold === 1) {
					await executeCreateZoraAuction(
						gnosisAddress,
						nft.id,
						nft.address,
						Number(duration),
						Number(reservePrice),
						curatorAddress,
						Number(curatorFeePercentage),
						customCurrency === "custom" ? currencyToken : "ETH",
						signatures,
						signer
					)
				}
			}
			await addProposal({
				type: "createZoraAuction",
				userAddress: account,
				gnosisAddress,
				title,
				...(description ? {description} : {}),
				nftId: nft.id,
				nftAddress: nft.address,
				duration: Number(duration),
				reservePrice: Number(reservePrice),
				curatorAddress,
				curatorFeePercentage: Number(curatorFeePercentage),
				auctionCurrency: customCurrency === "custom" ? currencyToken : "ETH",
				signatures
			})
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
			curatorFeePercentage &&
			duration
		) ||
		isNaN(Number(reservePrice)) ||
		isNaN(Number(curatorFeePercentage)) ||
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
				onChange={handleNFTChange}
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
						value={curatorFeePercentage}
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
