import {FunctionComponent, useContext, useState} from "react"
import {Link, useParams} from "react-router-dom"
import endAuction from "../../api/ethers/functions/auction/endAuction"
import Button from "../../components/Controls/Button"
import BidAuctionModal from "../../components/Modals/BidAuctionModal"
import ErrorPlaceholder from "../../components/UI/ErrorPlaceholder"
import Loader from "../../components/UI/Loader"
import {toastError, toastSuccess} from "../../components/UI/Toast"
import config from "../../config"
import networks from "../../constants/networks"
import {AuthContext} from "../../context/AuthContext"
import useNFT from "../../hooks/getters/useNFT"
import {Auction} from "../../types/auction"
import {formatReadableAddress, formatTimeDifference} from "../../utlls"
import "./styles.scss"

// const columns = [
// 	{
// 		id: "collector",
// 		name: "Collector"
// 	},
// 	{
// 		id: "date",
// 		name: "Date / Time"
// 	},
// 	{
// 		id: "activity",
// 		name: "Activity"
// 	}
// ] as const

const NftDetails: FunctionComponent = () => {
	const {id} = useParams<{id: string}>()
	const {nft, auctions, loading, error} = useNFT(id)
	const [processing, setProcessing] = useState(false)
	const {signer} = useContext(AuthContext)

	if (loading) return <Loader />
	if (error || !nft) return <ErrorPlaceholder />

	const auction: Auction | undefined = auctions[auctions.length - 1]

	const handleEnd = async () => {
		setProcessing(true)
		try {
			if (!(auction && signer)) return
			await endAuction(auction.id, signer)
			toastSuccess("Auction successfully ended!")
		} catch (e) {
			console.error(e)
			toastError("Failed to end auction")
		}
		setProcessing(false)
	}

	return (
		<div className="main__container">
			<div className="nft">
				<div className="nft__left-col">
					<Link to={`/${nft.ownerType === "dao" ? "dao" : "profile"}/${nft.owner}`}>
						{"< Back"}
					</Link>
					<h3>{nft.name}</h3>
					{nft.attributes?.editionNumber && nft.attributes.numberOfEditions && (
						<p>
							<b>
								Edition {nft.attributes.editionNumber} of {nft.attributes.numberOfEditions}
							</b>
						</p>
					)}
					<br />
					<p>
						<b>Creator:</b>
					</p>
					<Link to={`/profile/${nft.creator}`}>{formatReadableAddress(nft.creator)}</Link>
					<p>
						<b>Owner:</b>
					</p>
					<Link to={`/${nft.ownerType === "dao" ? "dao" : "profile"}/${nft.owner}`}>
						{formatReadableAddress(nft.owner)}
					</Link>
					{nft.desc && (
						<>
							<p>
								<b>Description:</b>
							</p>
							<p>{nft.desc}</p>
						</>
					)}
					<p>
						<b>Token ID:</b>
					</p>
					<p>{nft.id}</p>
					<p>
						<b>Token Address:</b>
					</p>
					<p>{formatReadableAddress(nft.address)}</p>
					<a
						target="_blank"
						rel="noopener noreferrer"
						href={`https://${
							config.CHAIN_ID === 1 ? "" : `${networks[config.CHAIN_ID]}.`
						}etherscan.io/token/${nft.address}?a=${nft.id}`}
					>
						<Button buttonType="secondary">View on Etherscan</Button>
					</a>
				</div>
				<div className="nft__right-col">
					<div className="nft__main">
						<div className="nft__image">
							{nft.media.mimeType.startsWith("video") ? (
								<video src={nft.thumbnail} autoPlay muted loop />
							) : (
								<img src={nft.thumbnail} />
							)}
						</div>
						<div className="nft__auction">
							{auction && auction.state !== "finalized" && (
								<div className="nft__auction-card">
									<h3>{`${auction.price} ${auction.tokenSymbol}`}</h3>
									{auction.state === "ended" ? (
										<Button disabled={processing} onClick={handleEnd}>
											{processing ? "Processing..." : "End Auction"}
										</Button>
									) : (
										<BidAuctionModal
											disabled={auction.state !== "waitingForBids" && auction.state !== "live"}
											auctionId={auction.id}
											minBid={auction.price}
											auctionTokenAddress={
												auction.tokenSymbol === "ETH" ? undefined : auction.tokenAddress
											}
										/>
									)}
									<p>
										<b>Auction ID:</b>
									</p>
									<p>{auction.id}</p>
									<p>
										<b>Auction Status:</b>
									</p>
									<p>{auction.state}</p>
									{auction.endTime && (
										<>
											<p>
												<b>Auction Ends in:</b>
											</p>
											<p>{formatTimeDifference(auction.endTime - new Date().getTime())}</p>
										</>
									)}
									<p>
										<b>Reserve Price:</b>
									</p>
									<p>{auction.reservePrice}</p>
									<br />
									<p>
										<b>Curator:</b>
									</p>
									<p>{formatReadableAddress(auction.curatorAddress)}</p>
								</div>
							)}
						</div>
					</div>
					{/* TODO */}
					{/*<div className="nft__bids">*/}
					{/*	<h2>Bids History</h2>*/}
					{/*	<Table data={mockBids} columns={columns} idCol="id" />*/}
					{/*</div>*/}
				</div>
			</div>
		</div>
	)
}

export default NftDetails
