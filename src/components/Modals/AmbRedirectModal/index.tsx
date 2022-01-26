import {FunctionComponent} from "react"
import config from "../../../config"
import Copy from "../../UI/Copy"
import Modal from "../Modal"
import "./styles.scss"

const AmbRedirectModal: FunctionComponent<{
	hash: string
	onClose: () => void
}> = ({hash, onClose}) => (
	<Modal show onClose={onClose} width={700} title="Manual Transaction Execution">
		<div className="amb-redirect-modal">
			<p>Please, proceed to the following link:</p>
			<a
				href={`https://alm-test-amb.herokuapp.com/${config.SIDE_CHAIN_ID}/${hash}`}
				rel="noopener noreferrer"
				target="_blank"
			>
				https://alm-test-amb.herokuapp.com/
			</a>
			<p>And enter this hash to make transaction pass the bridge:</p>
			<Copy value={hash}>{hash}</Copy>
		</div>
	</Modal>
)

export default AmbRedirectModal
