import React, {FunctionComponent} from "react"
import NFTGallery from "../../NFTGallery"
import CreateNFTModal from "../../Modals/CreateNFTModal"
import "./styles.scss"

const DAOCollection: FunctionComponent<{gnosisAddress: string}> = ({gnosisAddress}) => {
	return (
		<div className="dao-collection">
			<div className="dao-collection__edit-buttons">
				<CreateNFTModal gnosisAddress={gnosisAddress} />
			</div>
			<NFTGallery account={gnosisAddress} />
		</div>
	)
}

export default DAOCollection
