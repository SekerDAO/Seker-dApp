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

export const handleFetchNFTs = () => {
	return new Promise((resolve, reject) => {
		firestore
			.collection('nfts')
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

