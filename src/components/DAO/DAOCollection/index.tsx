import React, {FunctionComponent} from "react"
import NFTGallery from "../../NFTGallery"
import CreateNFTModal from "../../Modals/CreateNFTModal"
import "./styles.scss"

const DAOCollection: FunctionComponent<{daoAddress: string}> = ({daoAddress}) => {
	return (
		<div className="dao-collection">
			<div className="dao-collection__edit-buttons">
				<CreateNFTModal daoAddress={daoAddress} />
			</div>
			<NFTGallery account={daoAddress} />
		</div>
	)
}

export default DAOCollection
