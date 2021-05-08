import React, { useState } from 'react';
import Modal from './../../components/Modal';
import FormInput from './../../components/Forms/FormInput';
import FormSelect from './../../components/Forms/FormSelect';
import Button from './../../components/Forms/Button';
import CKEditor from 'ckeditor4-react';
import './styles.scss';

const Admin = props => {
  // const { nfts } = useSelector(mapState);
  // const dispatch = useDispatch();
  const [hideModal, setHideModal] = useState(true);
  const [nftCategory, setNFTCategory] = useState('art');
  const [nftName, setNFTName] = useState('');
  const [nftThumbnail, setNFTThumbnail] = useState('');
  const [nftPrice, setNFTPrice] = useState(0);
  const [nftDesc, setNFTDesc] = useState('');

  // const { data, queryDoc, isLastPage } = nfts;
	//
  // useEffect(() => {
  //   dispatch(
  //     fetchNFTsStart()
  //   );
  // }, []);

  const toggleModal = () => setHideModal(!hideModal);

  const configModal = {
    hideModal,
    toggleModal
  };

  const resetForm = () => {
    setHideModal(true);
    setNFTCategory('art');
    setNFTName('');
    setNFTThumbnail('');
    setNFTPrice(0);
    setNFTDesc('');
  };

  const handleSubmit = e => {
    e.preventDefault();

    // dispatch(
    //   addNFTStart({
    //     nftCategory,
    //     nftName,
    //     nftThumbnail,
    //     nftPrice,
    //     nftDesc,
    //   })
    // );
    resetForm();

  };

  const handleLoadMore = () => {
    // dispatch(
    //   fetchNFTsStart({
    //     startAfterDoc: queryDoc,
    //     persistNFTs: data
    //   })
    // );
  };

  return (
    <div className="admin">

      <div className="callToActions">
        <ul>
          <li>
            <Button onClick={() => toggleModal()}>
              Add new NFT
            </Button>
          </li>
        </ul>
      </div>

      <Modal {...configModal}>
        <div className="addNewNFTForm">
          <form onSubmit={handleSubmit}>

            <h2>
              Add new NFT
            </h2>

            <FormSelect
              label="Category"
              options={[{
                value: "gallery",
                name: "Gallery"
              }, {
                value: "exhibit",
                name: "Exhibit"
              }]}
              handleChange={e => setNFTCategory(e.target.value)}
            />

            <FormInput
              label="Name"
              type="text"
              value={nftName}
              handleChange={e => setNFTName(e.target.value)}
            />

            <FormInput
              label="Main image URL"
              type="url"
              value={nftThumbnail}
              handleChange={e => setNFTThumbnail(e.target.value)}
            />

            <FormInput
              label="Price"
              type="number"
              min="0.00"
              max="10000.00"
              step="0.01"
              value={nftPrice}
              handleChange={e => setNFTPrice(e.target.value)}
            />

            <CKEditor
              onChange={evt => setNFTDesc(evt.editor.getData())}
            />

            <br />

            <Button type="submit">
              Add NFT
            </Button>

          </form>
        </div>
      </Modal>

      <div className="manageNFTs">

        <table border="0" cellPadding="0" cellSpacing="0">
          <tbody>
            <tr>
              <th>
                <h1>
                  Manage NFTs
                </h1>
              </th>
            </tr>
            <tr>
              <td>
                <table className="results" border="0" cellPadding="10" cellSpacing="0">
                  <tbody>
                    {/*{(Array.isArray(data) && data.length > 0) && data.map((nft, index) => {*/}
                    {/*  const {*/}
                    {/*    nftName,*/}
                    {/*    nftThumbnail,*/}
                    {/*    nftPrice,*/}
                    {/*    documentID*/}
                    {/*  } = nft;*/}
										
                    {/*  return (*/}
                    {/*    <tr key={index}>*/}
                    {/*      <td>*/}
                    {/*        <img className="thumb" src={nftThumbnail} />*/}
                    {/*      </td>*/}
                    {/*      <td>*/}
                    {/*        {nftName}*/}
                    {/*      </td>*/}
                    {/*      <td>*/}
                    {/*        {nftPrice}Ξ*/}
                    {/*      </td>*/}
                    {/*      <td>*/}
                    {/*        <Button onClick={() => dispatch(deleteNFTStart(documentID))}>*/}
                    {/*          Delete*/}
                    {/*        </Button>*/}
                    {/*      </td>*/}
                    {/*    </tr>*/}
                    {/*  )*/}
                    {/*})}*/}
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>

              </td>
            </tr>
            <tr>
              <td>
                <table border="0" cellPadding="10" cellSpacing="0">
                  <tbody>
                    <tr>
                      <td>
                        {/*{!isLastPage && (*/}
	                      {/*  <Button*/}
		                    {/*    onClick={handleLoadMore}*/}
	                      {/*  >*/}
		                    {/*    Load More*/}
	                      {/*  </Button>*/}
                        {/*)}*/}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

      </div>

    </div>
  );
}

export default Admin;
