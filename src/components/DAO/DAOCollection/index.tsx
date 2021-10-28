import {FunctionComponent, useContext, useState} from "react"
import NFTGallery from "../../NFTGallery"
import CreateNFTModal from "../../Modals/CreateNFTModal"
import "./styles.scss"
import {AuthContext} from "../../../context/AuthContext"

const DAOCollection: FunctionComponent<{
	gnosisAddress: string
	isAdmin: boolean
	viewOnly?: boolean
}> = ({gnosisAddress, isAdmin, viewOnly}) => {
	const [galleryKey, setGalleryKey] = useState(Math.random())
	const {account} = useContext(AuthContext)

	const updateGallery = () => {
		setGalleryKey(Math.random())
	}

	return (
		<div className="dao-collection">
			<div className="dao-collection__edit-buttons">
				{!viewOnly && isAdmin && account && (
					<CreateNFTModal
						gnosisAddress={gnosisAddress}
						afterCreate={updateGallery}
						account={account}
					/>
				)}
			</div>
			<NFTGallery key={galleryKey} account={gnosisAddress} isDao canDelete={!viewOnly && isAdmin} />
		</div>
	)
}

export default DAOCollection
