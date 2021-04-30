import { combineReducers } from 'redux'
import userReducer from './User/user.reducer'
import nftReducer from './NFTs/nft.reducer'

export default combineReducers({
	user: userReducer,
	nftData: nftReducer
})