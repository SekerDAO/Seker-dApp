import { firestore } from './../../firebase/utils'

export const handleAddNFT = nft => {
	return new Promise((resolve, reject) => {
		firestore
			.collection('nfts')
			.doc()
			.set(nft)
			.then(() => {
				resolve()
			})
			.catch(err => {
				reject(err)
			})
	})
}

export const handleFetchNFTs = ({ filterType }) => {
	return new Promise((resolve, reject) => {

		let ref = firestore.collection('nfts').orderBy('createdDate')
		if(filterType) ref = ref.where('nftCategory', '==', filterType)
			
		ref
			.get()
			.then(snapshot => {
				const nftsArray = snapshot.docs.map(doc => {
					return {
						...doc.data(),
						documentID: doc.id
					}
				})
				resolve(nftsArray)
			})
			.catch(err => {
				reject(err)
			})
	})
}

export const handleDeleteNFT = documentID => {
	return new Promise((resolve, reject) => {
		firestore
			.collection('nfts')
			.doc(documentID)
			.delete()
			.then(() => {
				resolve()
			})
			.catch(err => {
				reject(err)
			})
	})
}

