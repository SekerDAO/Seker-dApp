import React, {FunctionComponent} from "react"
import {useParams} from "react-router-dom"
import useNFT from "../../customHooks/getters/useNFT"
import Loader from "../../components/Loader"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import "./styles.scss"
import Table from "../../components/Table"
import Button from "../../components/Controls/Button"
import {ZoraAuction} from "../../types/zoraAuction"
import {formatTimeDifference} from "../../utlls"
import BidAuctionModal from "../../components/Modals/BidAuctionModal"
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

	if (loading) return <Loader />
	if (error || !nft) return <ErrorPlaceholder />

	const auction: ZoraAuction | undefined = auctions[auctions.length - 1]

	return (
		<div className="main__container">
			<div className="nft">
				<div className="nft__left-col">
					<h3>{nft.name}</h3>
					<p>
						<b>Edition {nft.attributes?.editionNumber ?? "unknown"}</b>
					</p>
					<br />
					<p>
						<b>Creator:</b>
					</p>
					<p>TODO</p>
					<p>
						<b>Owner:</b>
					</p>
					<p>{`${nft.nftAdminUserUID.slice(0, 3)}...${nft.nftAdminUserUID.slice(-4)}`}</p>
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
							{auction && (
								<div className="nft__auction-card">
									<h3>{`${auction.price} ${auction.tokenSymbol}`}</h3>
									<BidAuctionModal
										disabled={auction.state !== "approved" && auction.state !== "live"}
										auctionId={auction.id}
										minBid={auction.price}
										auctionTokenAddress={
											auction.tokenSymbol === "ETH" ? undefined : auction.tokenAddress
										}
									/>
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
