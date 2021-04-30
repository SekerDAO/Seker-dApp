import { all, call } from 'redux-saga/effects'
import userSagas from './User/user.sagas'
import nftSagas from './NFTs/nft.sagas'

export default function* rootSaga() {
	yield all([
		call(userSagas),
		call(nftSagas)
	])
}