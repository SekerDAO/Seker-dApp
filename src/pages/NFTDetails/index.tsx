import React, {FunctionComponent, useContext, useState} from "react"
import {Link, useParams} from "react-router-dom"
import useNFT from "../../customHooks/getters/useNFT"
import Loader from "../../components/Loader"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import "./styles.scss"
import Table from "../../components/Table"
import Button from "../../components/Controls/Button"
import {ZoraAuction} from "../../types/zoraAuction"
import {formatTimeDifference} from "../../utlls"
import BidAuctionModal from "../../components/Modals/BidAuctionModal"
import {toastError, toastSuccess} from "../../components/Toast"
import endZoraAuction from "../../api/ethers/functions/zoraAuction/endZoraAuction"
import EthersContext from "../../context/EthersContext"
const {REACT_APP_CHAIN_ID} = process.env

const columns = [
	{
		id: "collector",
		name: "Collector"
	},
	{
		id: "date",
		name: "Date / Time"
	},
	{
		id: "activity",
		name: "Activity"
	}
] as const

const mockBids = [
	{
		id: "123",
		collector: "Joe",
		date: "2021-08-02",
		activity: "Sold for 2 ETH"
	},
	{
		id: "1234",
		collector: "Jack",
		date: "2021-08-02",
		activity: "Placed an offer for 1 ETH"
	}
]

const NFTCard: FunctionComponent = () => {
	const {id} = useParams<{id: string}>()
	const {nft, auctions, loading, error} = useNFT(id)
	const [processing, setProcessing] = useState(false)
	const {signer} = useContext(EthersContext)

	if (loading) return <Loader />
	if (error || !nft) return <ErrorPlaceholder />

	const auction: ZoraAuction | undefined = auctions[auctions.length - 1]

	const handleEnd = async () => {
		setProcessing(true)
		try {
			if (!(auction && signer)) return
			await endZoraAuction(auction.id, signer)
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
					<Link to={`/profile/${nft.creator}`}>{`${nft.creator.slice(0, 3)}...${nft.creator.slice(
						-4
					)}`}</Link>
					<p>
						<b>Owner:</b>
					</p>
					<Link
						to={`/${nft.ownerType === "dao" ? "dao" : "profile"}/${nft.owner}`}
					>{`${nft.owner.slice(0, 3)}...${nft.owner.slice(-4)}`}</Link>
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
					<p>{`${nft.address.slice(0, 3)}...${nft.address.slice(-4)}`}</p>
					<a
						target="_blank"
						rel="noopener noreferrer"
						href={`https://${REACT_APP_CHAIN_ID === "0x4" ? "rinkeby." : ""}etherscan.io/token/${
							nft.address
						}?a=${nft.id}`}
					>
						<Button buttonType="secondary">View on Etherscan</Button>
					</a>
				</div>
				<div className="nft__right-col">
					<div className="nft__main">
						<div className="nft__image">
							{nft.media.mimeType.startsWith("video") ? (
								<video src={nft.thumbnail} autoPlay muted />
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
											disabled={auction.state !== "approved" && auction.state !== "live"}
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
									<p>{`${auction.curatorAddress.slice(0, 3)}...${auction.curatorAddress.slice(
										-4
									)}`}</p>
								</div>
							)}
						</div>
					</div>
					<div className="nft__bids">
						<h2>TODO: Bids History</h2>
						<Table data={mockBids} columns={columns} idCol="id" />
					</div>
				</div>
			</div>
		</div>
	)
}

export default NFTCard
