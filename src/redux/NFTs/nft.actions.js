import nftTypes from './nft.types';

export const addNFTStart = nftData => ({
  type: nftTypes.ADD_NEW_NFT_START,
  payload: nftData
});

export const fetchNFTsStart = (filters={}) => ({
  type: nftTypes.FETCH_NFTS_START,
  payload: filters
});

export const setNFTs = nfts => ({
  type: nftTypes.SET_NFTS,
  payload: nfts
});

export const deleteNFTStart = nftID => ({
  type: nftTypes.DELETE_NFT_START,
  payload: nftID
});

export const fetchNFTStart = nftID => ({
  type: nftTypes.FETCH_NFT_START,
  payload: nftID
});

export const setNFT = nft => ({
  type: nftTypes.SET_NFT,
  payload: nft
});