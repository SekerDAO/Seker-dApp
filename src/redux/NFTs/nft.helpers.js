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

export const handleFetchNFTs = ({ filterType, startAfterDoc }) => {
	return new Promise((resolve, reject) => {
		const pageSize = 8

		let ref = firestore.collection('nfts').orderBy('createdDate').limit(pageSize)
		if(filterType) ref = ref.where('nftCategory', '==', filterType)
		if(startAfterDoc) ref = ref.startAfter(startAfterDoc)

		ref
			.get()
			.then(snapshot => {
				const totalCount = snapshot.size

				const data = [
					...snapshot.docs.map(doc => {
						return {
							...doc.data(),
							documentID: doc.id
						}
					})
				]
				resolve({
					data,
					queryDoc: snapshot.docs[totalCount - 1],
					isLastPage: totalCount < 1
				})
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

export const handleFetchNFT = (nftID) => {
	return new Promise((resolve, reject) => {
		firestore
			.collection('nfts')
			.doc(nftID)
			.get()
			.then(snapshot => {
				if (snapshot.exists) {
					resolve({
						...snapshot.data(),
						documentID: nftID
					})
				}
			})
			.catch(err => {
				reject(err)
			})
	})	
}

// export const setNFT = nft => {
// 	return new Promise((resolve, reject) => {

// 	})
// }

