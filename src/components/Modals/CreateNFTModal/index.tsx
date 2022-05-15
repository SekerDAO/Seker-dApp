import {FunctionComponent, useState} from "react"
import useUser from "../../../hooks/getters/useUser"
import Button from "../../Controls/Button"
import CreateNFTForm from "../../CreateNFTForm"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import Loader from "../../UI/Skeleton"
import Modal from "../Modal"

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
