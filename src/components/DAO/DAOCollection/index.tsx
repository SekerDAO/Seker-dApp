import {FunctionComponent, useContext, useState} from "react"
import NFTGallery from "../../NFTGallery"
import CreateNFTModal from "../../Modals/CreateNFTModal"
import "./styles.scss"
import {AuthContext} from "../../../context/AuthContext"
import Button from "../../Controls/Button"
import {ModalContext} from "../../../context/ModalContext"

const DAOCollection: FunctionComponent<{
	gnosisAddress: string
	canEdit: boolean
}> = ({gnosisAddress, canEdit}) => {
	const {setOverlay} = useContext(ModalContext)
	const [galleryKey, setGalleryKey] = useState(Math.random())
	const {account} = useContext(AuthContext)

	const updateGallery = () => {
		setGalleryKey(Math.random())
	}

	return (
		<div className="dao-collection">
			<div className="dao-collection__edit-buttons">
				{canEdit && account && (
					<Button
						buttonType={gnosisAddress ? "primary" : "secondary"}
						onClick={() => {
							setOverlay({
								key: "Create NFT",
								component: (
									<CreateNFTModal
										gnosisAddress={gnosisAddress}
										afterCreate={updateGallery}
										account={account}
									/>
								)
							})
						}}
					>
						{gnosisAddress ? "Enter NFT" : "Create / Load NFT"}
					</Button>
				)}
			</div>
			<NFTGallery key={galleryKey} account={gnosisAddress} isDao canDelete={canEdit} />
		</div>
	)
}

export default DAOCollection
