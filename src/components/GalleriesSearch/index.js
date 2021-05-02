import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { fetchNFTsStart } from './../../redux/NFTs/nft.actions'
import Gallery from './Gallery'
import FormSelect from './../Forms/FormSelect'
import './styles.scss'

const mapState = ({ nftData }) => ({
	nfts: nftData.nfts
})

const GalleriesSearch = () => {
	const dispatch = useDispatch()
	const history = useHistory()
	const { filterType } = useParams()
	const { nfts } = useSelector(mapState)

	useEffect(() => {
		dispatch(
			fetchNFTsStart({ filterType })
		)
	}, [filterType])

	const handleFilter = (e) => {
		const nextFilter = e.target.value
		history.push(`/galleries/${nextFilter}`)
	}

	//if(Array.isArray(nfts)) return null

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

	return (
		<div className="galleries">
			<div className="galleryResults">
				<h1>
					Browse Galleries
				</h1>

				<FormSelect {...configFilters} />

				{nfts.map((nft, pos) => {
					const { nftThumbnail, nftName, nftPrice, nftCategory } = nft
					if(!nftThumbnail || !nftName || typeof nftPrice === 'undefined') return null
					const configGallery = {
						nftThumbnail,
						nftName,
						nftPrice
					}
					return(
						<Gallery {...configGallery} />
					)
				})}
			</div>
		</div>
	)
}

export default GalleriesSearch