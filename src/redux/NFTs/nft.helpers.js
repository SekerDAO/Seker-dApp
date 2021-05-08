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
