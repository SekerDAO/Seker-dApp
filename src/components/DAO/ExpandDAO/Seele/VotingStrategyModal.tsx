import {ChangeEvent, FormEvent, FunctionComponent, useState} from "react"
import {ReactComponent as WarningIcon} from "../../../../assets/icons/warning.svg"
import {SeeleVotingStrategy} from "../../../../types/seele"
import Button from "../../../Controls/Button"
import Input from "../../../Controls/Input"
import Modal from "../../../Modals/Modal"
import Divider from "../../../UI/Divider"
import {VOTING_STRATEGIES_CONTENT} from "./VotingStrategyCard"

export type VotingStrategyFormValues = {[key: string]: string}

const EMPTY_STATE = {
	erc20TokenAddress: "",
	votingPeriod: "",
	delay: "",
	quorumThreshold: "",
	designatedERC20TokenAddress: "",
	designatedERC20TokemCirculatingSupply: ""
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
				{votingStrategy === "molochLinearVoting" && (
					<>
						<Divider />
						<div className="voting-strategy-form__row">
							<label>Designated ERC-20 Token Address to Define Shares</label>
							<Input
								name="designatedERC20TokenAddress"
								value={formValues.designatedERC20TokenAddress}
								onChange={handleChange}
							/>
						</div>
						<div className="voting-strategy-form__row voting-strategy-form__warning-message">
							<div className="voting-strategy-form__warning-icon">
								<WarningIcon width="22px" height="22px" />
							</div>
							<p>Please note that the designated token address can not be zero.</p>
						</div>
						<div className="voting-strategy-form__row">
							<label>Designated ERC-20 Token Circulating Supply</label>
							<Input
								name="designatedERC20TokemCirculatingSupply"
								value={formValues.designatedERC20TokemCirculatingSupply}
								onChange={handleChange}
							/>
						</div>
					</>
				)}
				<Button type="submit">Submit</Button>
			</form>
		</Modal>
	)
}

export default VotingStrategyModal
