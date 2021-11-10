import {FunctionComponent} from "react"
import {BuiltVotingStrategy, VotingStrategy} from "../../../types/DAO"
import ConfirmationModal from "../ConfirmationModal"
import DeployLinearVotingStrategyModal from "./DeployLinearVotingStrategyModal"
import "./styles.scss"

const DeployVotingStrategyModal: FunctionComponent<{
	gnosisAddress: string
	strategy: VotingStrategy
	onSubmit: (strategy: BuiltVotingStrategy) => void
	onClose: () => void
}> = ({gnosisAddress, strategy, onSubmit, onClose}) => {
	switch (strategy) {
		case "linearVotingCompoundBravo":
			return (
				<DeployLinearVotingStrategyModal
					gnosisAddress={gnosisAddress}
					onSubmit={onSubmit}
					onClose={onClose}
				/>
			)
		default:
			return (
				<ConfirmationModal
					title="TODO"
					text="This voting strategy is not implemented yet"
					onSubmit={async () => {
						onClose()
					}}
					submitText="OK"
					isOpened
					handleClose={onClose}
				/>
			)
	}
}

export default DeployVotingStrategyModal
