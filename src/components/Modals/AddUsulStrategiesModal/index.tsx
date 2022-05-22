import {FunctionComponent, useState} from "react"
import {VOTING_STRATEGIES} from "../../../constants/votingStrategies"
import {Usul} from "../../../types/DAO"
import Select from "../../Controls/Select"
import Modal from "../Modal"
import "./styles.scss"

const AddUsulStrategiesModal: FunctionComponent<{
	onClose: () => void
	onSubmit: (usul: Usul, strategyIndex: number) => void
	usul: Usul
}> = ({onClose, onSubmit, usul}) => {
	const [selectedStrategyIndex, setSelectedStrategyIndex] = useState<number | null>(null)

	const handleSubmit = () => {
		if (selectedStrategyIndex === null) return
		onSubmit(usul, selectedStrategyIndex)
	}

	const submitButtonDisabled = selectedStrategyIndex === null

	return (
		<Modal
			show
			onClose={onClose}
			title="Add Usul Strategies"
			onSubmit={handleSubmit}
			submitButtonDisabled={submitButtonDisabled}
		>
			<div className="add-usul-strategies-modal">
				<p>Add Usul Strategies</p>
				<div className="add-usul-strategies-modal__input">
					<label htmlFor="add-strategies-strategy">Voting Strategy</label>
					<Select
						id="add-strategies-strategy"
						fullWidth
						onChange={val => {
							setSelectedStrategyIndex(val)
						}}
						placeholder="Choose One"
						options={usul.strategies.map((strategy, index) => ({
							name:
								VOTING_STRATEGIES.find(s => s.strategy === strategy.name)?.title ?? strategy.name,
							value: index
						}))}
						value={selectedStrategyIndex}
					/>
				</div>
			</div>
		</Modal>
	)
}

export default AddUsulStrategiesModal
