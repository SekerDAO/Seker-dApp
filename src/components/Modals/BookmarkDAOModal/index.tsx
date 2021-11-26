import {FunctionComponent, useState} from "react"
import {ReactComponent as BookmarkIcon} from "../../../assets/icons/bookmark.svg"
import Button from "../../Controls/Button"
import Input from "../../Controls/Input"
import Divider from "../../UI/Divider"
import Modal from "../Modal"
import "./styles.scss"

const BookmarkDAOModal: FunctionComponent<{
	onSubmit: (daoAddress: string) => void
	submitButtonDisabled?: boolean
}> = ({onSubmit, submitButtonDisabled}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [daoAddress, setDaoAddress] = useState("")

	const handleSubmit = () => {
		onSubmit(daoAddress)
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
				submitButtonText="Submit"
				submitButtonDisabled={!daoAddress || submitButtonDisabled}
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
