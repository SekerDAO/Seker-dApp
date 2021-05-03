
import { auth } from './../../firebase/utils';
import { takeLatest, put, all, call } from 'redux-saga/effects';
import { setNFTs, setNFT, fetchNFTsStart } from './nft.actions';
import { handleAddNFT, handleFetchNFTs, handleDeleteNFT, handleFetchNFT } from './nft.helpers';
import nftTypes from './nft.types';

// export function* addNFT({ payload: {
//   nftCategory,
//   nftName,
//   nftThumbnail,
//   nftPrice,

// }}) {
//   const timestamp = new Date();

//   try {
//     yield handleAddNFT({
//       nftCategory,
//       nftName,
//       nftThumbnail,
//       nftPrice,
//       nftAdminUserUID: auth.currentUser.uid,
//       createdDate: timestamp
//     })
//     yield put(
//       fetchNFTsStart()
//     );
//   } catch(err) {
//     console.log(err)
//   }

// }

export function* addNFT({ payload }) {

  try {
    const timestamp = new Date();
    yield handleAddNFT({
      ...payload,
      nftAdminUserUID: auth.currentUser.uid,
      createdDate: timestamp
    });
    yield put(
      fetchNFTsStart()
    );


  } catch (err) {
    console.log(err);
  }

}

export function* onAddNFTStart() {
  yield takeLatest(nftTypes.ADD_NEW_NFT_START, addNFT);
}

export function* fetchNFts({ payload }) {
  try {
    const nfts = yield handleFetchNFTs(payload);
    yield put(
      setNFTs(nfts)
    );

  } catch (err) {
    console.log(err);
  }
}

export function* onFetchNFTsStart() {
  yield takeLatest(nftTypes.FETCH_NFTS_START, fetchNFts);
}

export function* deleteNFT({ payload }) {
  try {
    yield handleDeleteNFT(payload);
    yield put (
      fetchNFTsStart()
    );

  } catch (err) {
    console.log(err);
  }
}

export function* onDeleteNFTStart() {
  yield takeLatest(nftTypes.DELETE_NFT_START, deleteNFT);
}

export function* fetchNFT({ payload }) {
  try {
    const nft = yield handleFetchNFT(payload);
    yield put(
      setNFT(nft)
    );

  } catch (err) {
    console.log(err);
  }
}

export function* onFetchNFTStart() {
  yield takeLatest(nftTypes.FETCH_NFT_START, fetchNFT);
}

export default function* nftSagas() {
  yield all([
    call(onAddNFTStart),
    call(onFetchNFTsStart),
    call(onDeleteNFTStart),
    call(onFetchNFTStart),
  ])
}