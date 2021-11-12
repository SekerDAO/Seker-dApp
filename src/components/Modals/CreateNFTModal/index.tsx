import {FunctionComponent, useState} from "react"
import Button from "../../Controls/Button"
import Modal from "../Modal"
import useUser from "../../../hooks/getters/useUser"
import Loader from "../../UI/Loader"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import CreateNFTForm from "../../CreateNFTForm"

const CreateNFTModal: FunctionComponent<{
	gnosisAddress?: string
	afterCreate?: () => void
	account: string
}> = ({gnosisAddress, afterCreate, account}) => {
	const [isOpened, setIsOpened] = useState(false)
	const {user, loading, error} = useUser(account)

	return (
		<>
			<Button
				buttonType={gnosisAddress ? "primary" : "secondary"}
				onClick={() => {
					setIsOpened(true)
				}}
			>
				{gnosisAddress ? "Enter NFT" : "Create / Load NFT"}
			</Button>
			<Modal
				show={isOpened}
				onClose={() => {
					setIsOpened(false)
				}}
			>
				{!user || loading ? (
					<Loader />
				) : error ? (
					<ErrorPlaceholder />
				) : (
					<CreateNFTForm
						gnosisAddress={gnosisAddress}
						afterCreate={afterCreate}
						domains={user.myDomains}
					/>
				)}
			</Modal>
		</>
	)
}

export default CreateNFTModal
