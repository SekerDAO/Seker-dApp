import React, {FunctionComponent} from "react"
import {useParams} from "react-router-dom"
import useNFT from "../../customHooks/getters/useNFT"
import Loader from "../../components/Loader"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import "./styles.scss"
import Table from "../../components/Table"
import Button from "../../components/Controls/Button"

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
	const {NFT, loading, error} = useNFT(id)

	if (loading) return <Loader />
	if (error || !NFT) return <ErrorPlaceholder />

	return (
		<div className="main__container">
			<div className="nft">
				<div className="nft__left-col">
					<h3>{NFT.name}</h3>
					<p>
						<b>Edition {NFT.attributes?.editionNumber ?? "unknown"}</b>
					</p>
					<br />
					<p>
						<b>Creator:</b>
					</p>
					<p>TODO</p>
					<p>
						<b>Owner:</b>
					</p>
					<p>{`${NFT.nftAdminUserUID.slice(0, 3)}...${NFT.nftAdminUserUID.slice(-4)} `}</p>
					{NFT.desc && (
						<>
							<p>
								<b>Description:</b>
							</p>
							<p>{NFT.desc}</p>
						</>
					)}
					<p>
						<b>Token ID:</b>
					</p>
					<p>TODO</p>
					<p>
						<b>Token Address:</b>
					</p>
					<p>TODO</p>
					{/* TODO */}
					<Button buttonType="secondary">View on Etherscan</Button>
				</div>
				<div className="nft__right-col">
					<div className="nft__main">
						<div className="nft__image">
							{NFT.media.mimeType.startsWith("video") ? (
								<video src={NFT.thumbnail} autoPlay muted />
							) : (
								<img src={NFT.thumbnail} />
							)}
						</div>
						<div className="nft__auction">
							<div className="nft__auction-card">
								<h3>TODO: Price</h3>
								<Button>Place Bid</Button>
								<p>
									<b>Auction ID:</b>
								</p>
								<p>TODO</p>
								<p>
									<b>Auction Status:</b>
								</p>
								<p>TODO</p>
								<p>
									<b>Auction Ends in:</b>
								</p>
								<p>TODO</p>
								<p>
									<b>Reserve Price:</b>
								</p>
								<p>TODO</p>
								<br />
								<p>
									<b>Curator:</b>
								</p>
								<p>TODO</p>
							</div>
						</div>
					</div>
					<div className="nft__bids">
						<h2>Bids History</h2>
						<Table data={mockBids} columns={columns} idCol="id" />
					</div>
				</div>
			</div>
		</div>
	)
}

export default NFTCard
