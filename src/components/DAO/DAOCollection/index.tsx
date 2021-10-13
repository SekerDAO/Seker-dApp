import React, {FunctionComponent, useContext, useState} from "react"
import NFTGallery from "../../NFTGallery"
import CreateNFTModal from "../../Modals/CreateNFTModal"
import "./styles.scss"
import {AuthContext} from "../../../context/AuthContext"

const DAOCollection: FunctionComponent<{
	gnosisAddress: string
	isAdmin: boolean
}> = ({gnosisAddress, isAdmin}) => {
	const [galleryKey, setGalleryKey] = useState(Math.random())
	const {account} = useContext(AuthContext)

	const updateGallery = () => {
		setGalleryKey(Math.random())
	}

	return (
		<div className="dao-collection">
			<div className="dao-collection__edit-buttons">
				{isAdmin && account && (
					<CreateNFTModal
						gnosisAddress={gnosisAddress}
						afterCreate={updateGallery}
						account={account}
					/>
				)}
			</div>
			<NFTGallery key={galleryKey} account={gnosisAddress} isDao canDelete={isAdmin} />
		</div>
	)
}

export default DAOCollection
