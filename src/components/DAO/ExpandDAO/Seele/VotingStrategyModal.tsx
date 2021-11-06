import {ChangeEvent, FormEvent, FunctionComponent, useState} from "react"
import {SeeleVotingStrategy} from "../../../../types/seele"
import Button from "../../../Controls/Button"
import Input from "../../../Controls/Input"
import Modal from "../../../Modals/Modal"
import {VOTING_STRATEGIES_CONTENT} from "./VotingStrategyCard"

export type VotingStrategyFormValues = {[key: string]: string}

const EMPTY_STATE = {
	erc20TokenAddress: "",
	votingPeriod: "",
	delay: "",
	quorumThreshold: ""
}

const VotingStrategyModal: FunctionComponent<{
	show: boolean
	votingStrategy?: SeeleVotingStrategy
	initialState?: VotingStrategyFormValues
	onClose: () => void
	onSubmit: (votingStrategy: SeeleVotingStrategy, formValues: VotingStrategyFormValues) => void
}> = ({show, votingStrategy, initialState = EMPTY_STATE, onClose, onSubmit}) => {
	const [formValues, setFormValues] = useState<VotingStrategyFormValues>(initialState)
	if (!votingStrategy) {
		return null
	}
	const {title} = VOTING_STRATEGIES_CONTENT[votingStrategy]

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		onSubmit(votingStrategy, formValues)
	}
	const handleChange = ({target: {name, value}}: ChangeEvent<HTMLInputElement>) => {
		setFormValues(prevState => ({...prevState, [name]: value}))
	}

	return (
		<Modal show={show} onClose={onClose}>
			<form className="voting-strategy-form" onSubmit={handleSubmit}>
				<h2>Deploy Strategy</h2>
				<h3>{title}</h3>
				{votingStrategy !== "singleVotingSimpleMembership" && (
					<div className="voting-strategy-form__row">
						<label>ERC-20 Token Address</label>
						<Input
							name="erc20TokenAddress"
							value={formValues.erc20TokenAddress}
							onChange={handleChange}
						/>
					</div>
				)}
				<div className="voting-strategy-form__row">
					<div className="voting-strategy-form__col">
						<label>Voting Period</label>
						<Input
							number
							placeholder="# of hours"
							name="votingPeriod"
							value={formValues.votingPeriod}
							onChange={handleChange}
						/>
					</div>
					<div className="voting-strategy-form__col">
						<label>Time Delay</label>
						<Input
							number
							placeholder="# of hours"
							name="delay"
							value={formValues.delay}
							onChange={handleChange}
						/>
					</div>
				</div>
				<div className="voting-strategy-form__row">
					<label>Quorum Threshold</label>
					<Input
						number
						placeholder="# of tokens"
						name="quorumThreshold"
						value={formValues.quorumThreshold}
						onChange={handleChange}
					/>
				</div>
				<Button type="submit">Submit</Button>
			</form>
		</Modal>
	)
}

export default VotingStrategyModal
