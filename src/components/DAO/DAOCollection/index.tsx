import {FunctionComponent, useContext, useState} from "react"
import NFTGallery from "../../NFTGallery"
import CreateNFTModal from "../../Modals/CreateNFTModal"
import "./styles.scss"
import {AuthContext} from "../../../context/AuthContext"

const DAOCollection: FunctionComponent<{
	gnosisAddress: string
	canEdit: boolean
}> = ({gnosisAddress, canEdit}) => {
	const [galleryKey, setGalleryKey] = useState(Math.random())
	const {account} = useContext(AuthContext)

	const updateGallery = () => {
		setGalleryKey(Math.random())
	}

	return (
		<div className="dao-collection">
			<div className="dao-collection__edit-buttons">
				{canEdit && account && (
					<CreateNFTModal
						gnosisAddress={gnosisAddress}
						afterCreate={updateGallery}
						account={account}
					/>
				)}
			</div>
			<NFTGallery key={galleryKey} account={gnosisAddress} isDao canDelete={canEdit} />
		</div>
	)
}

export default DAOCollection
