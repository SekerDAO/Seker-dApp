import React, {useState} from 'react'
import { useHistory, useParams } from 'react-router-dom'
import Gallery from '../../components/Gallery'
import FormSelect from '../../components/Forms/FormSelect'
import './styles.scss'
import useNFTs from "../../customHooks/useNFTs.js"
import Loader from "../../components/Loader"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import Button from "../../components/Forms/Button"

const Galleries = () => {
	const history = useHistory()
	const { filters } = useParams()
	const [cursor, setCursor] = useState(null)
	const {NFTs, loading, error} = useNFTs({filters, after: cursor})
	
	if (error) return <ErrorPlaceholder/>
	if (loading) return <Loader/>
	if (NFTs.data.length === 0) {
		return (
			<p> No Search Results </p>
		)
	}
	
	const handleFilter = (e) => {
		const nextFilter = e.target.value
		history.push(`/galleries/${nextFilter}`)
	}
	
	const configFilters = {
		defaultValue: filters,
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
		setCursor(NFTs.data[NFTs.data.length - 1])
	}
	
	return (
		<div className="galleries">
			<div className="galleryResults">
				<h1>
					Browse Galleries
				</h1>
				
				<FormSelect {...configFilters} />
				
				{NFTs.data.map(doc => {
					const { nftThumbnail, nftName, nftPrice } = doc.data()
					const {id} = doc
					if (!id || !nftThumbnail || !nftName || nftPrice === undefined) {
						return null
					}
					return <Gallery
						key={id}
						id={id}
						thumbnail={nftThumbnail}
						name={nftName}
						price={nftPrice}
					/>
				})}
			</div>
			
			{NFTs.data.length < NFTs.totalCount && <Button
				onClick={handleLoadMore}
			>
				Load More
			</Button>}
		</div>
	)
}

export default Galleries
