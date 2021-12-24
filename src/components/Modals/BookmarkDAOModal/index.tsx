import {FunctionComponent, useState} from "react"
import addMyDao from "../../../api/firebase/DAO/addMyDao"
import {ReactComponent as BookmarkIcon} from "../../../assets/icons/bookmark.svg"
import Button from "../../Controls/Button"
import Input from "../../Controls/Input"
import Divider from "../../UI/Divider"
import {toastError, toastSuccess} from "../../UI/Toast"
import Modal from "../Modal"
import "./styles.scss"

const BookmarkDAOModal: FunctionComponent<{
	afterSubmit: () => void
}> = ({afterSubmit}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [daoAddress, setDaoAddress] = useState("")
	const [processing, setProcessing] = useState(false)

	const handleSubmit = async () => {
		setProcessing(true)
		try {
			await addMyDao(daoAddress)
			toastSuccess("DAO successfully bookmarked")
			setIsOpen(false)
			afterSubmit()
		} catch (e) {
			console.error(e)
			toastError("Failed to bookmark DAO")
		}
		setProcessing(false)
	}

	return (
		<>
			<Button buttonType="link" extraClassName="profile__add-dao" onClick={() => setIsOpen(true)}>
				<BookmarkIcon width="15px" height="20px" />
				Add a DAO
			</Button>
			<Modal
				show={isOpen}
				title="Add a DAO"
				onSubmit={handleSubmit}
				submitButtonText={processing ? "Processing..." : "Submit"}
				submitButtonDisabled={!daoAddress || processing}
				onClose={() => setIsOpen(false)}
			>
				<div className="bookmark-dao">
					<p>
						Want to keep tabs on a DAO you are interested in? Add the DAO address below to populate
						your DAO list for easy future access.
					</p>
					<Divider />
					<label>DAO Address</label>
					<Input borders="all" onChange={e => setDaoAddress(e.target.value)} value={daoAddress} />
				</div>
			</Modal>
		</>
	)
}

export default BookmarkDAOModal
