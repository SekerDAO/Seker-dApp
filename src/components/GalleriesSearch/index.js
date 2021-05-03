import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { fetchNFTsStart } from './../../redux/NFTs/nft.actions'
import Gallery from './Gallery'
import FormSelect from './../Forms/FormSelect'
import LoadMore from './../LoadMore'
import './styles.scss'

const mapState = ({ nftData }) => ({
	nfts: nftData.nfts
})

const GalleriesSearch = () => {
	const dispatch = useDispatch()
	const history = useHistory()
	const { filterType } = useParams()
	const { nfts } = useSelector(mapState)

	const { data, queryDoc } = nfts

	// doesnt work
	useEffect(() => {
	  window.scrollTo(0, 0)
	}, [])

	useEffect(() => {
		dispatch(
			fetchNFTsStart({ filterType })
		)
	}, [filterType])

	const handleFilter = (e) => {
		const nextFilter = e.target.value
		history.push(`/galleries/${nextFilter}`)
	}

	//if(Array.isArray(data)) return null

	// this is all broken
	if(nfts.length < 1) {
		return (
			<p> No Search Results </p>
		)
	}

	const configFilters = {
		defaultValue: filterType,
		options: [{
			name: 'Show All',
			value: ''
		}, {
			name: 'Gallery',
			value: 'gallery'
		}, {
			name: 'Exhibit',
			value: 'exhibit'
		}],
		handleChange: handleFilter
	}

	const handleLoadMore = () => {
		dispatch(
			fetchNFTsStart({ filterType, startAfterDoc: queryDoc })
		)
	}

	const configLoadMore = {
		onLoadMoreEvt: handleLoadMore
	}

	return (
		<div className="galleries">
			<div className="galleryResults">
				<h1>
					Browse Galleries
				</h1>

				<FormSelect {...configFilters} />

				{data.map((nft, pos) => {
					const { nftThumbnail, nftName, nftPrice, nftCategory } = nft
					if(!nftThumbnail || !nftName || typeof nftPrice === 'undefined') return null
					const configGallery = {
						...nft
					}
					return(
						<Gallery {...configGallery} />
					)
				})}
			</div>

			<LoadMore {...configLoadMore} />

		</div>
	)
}

export default GalleriesSearch