import nftTypes from './nft.types';

const INITIAL_STATE = {
  nfts: [],
  nft: {},
};

const nftReducer = (state=INITIAL_STATE, action) => {
  switch(action.type) {
    case nftTypes.SET_NFTS:
      return {
        ...state,
        nfts: action.payload
      }
    case nftTypes.SET_NFT:
      return {
        ...state,
        nft: action.payload
      }
    default:
      return state;
  }
};

export default nftReducer;