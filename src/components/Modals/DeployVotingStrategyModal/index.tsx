import {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import {VotingStrategy} from "../../../types/DAO"
import EthersContext from "../../../context/EthersContext"
import Modal from "../Modal"
import Input from "../../Controls/Input"
import Button from "../../Controls/Button"
import CreateERC20TokenModal from "../CreateERC20TokenModal"
import {ERC20Token} from "../../../types/ERC20Token"
import Divider from "../../UI/Divider"
import {ReactComponent as WarningIcon} from "../../../assets/icons/warning.svg"
import "./styles.scss"
import {VOTING_STRATEGIES} from "../../../constants/votingStrategies"

export type VotingStrategyFormValues = {[key: string]: string}

const EMPTY_STATE = {
	erc20TokenAddress: "",
	votingPeriod: "",
	delay: "",
	quorumThreshold: "",
	designatedERC20TokenAddress: "",
	designatedERC20TokemCirculatingSupply: ""
}

const DeployVotingStrategyModal: FunctionComponent<{
	strategy: VotingStrategy
	onSubmit: (strategy: VotingStrategy, formValues: VotingStrategyFormValues) => void
	onClose: () => void
}> = ({strategy, onSubmit, onClose}) => {
	const [createTokenModalOpened, setCreateTokenModalOpened] = useState(false)
	const {signer} = useContext(EthersContext)
	const [formValues, setFormValues] = useState<VotingStrategyFormValues>(EMPTY_STATE)

	const {votingPeriod, delay, quorumThreshold} = formValues
	const subTitle = VOTING_STRATEGIES.find(
		votingStrategy => votingStrategy.strategy === strategy
	)?.title
	const handleTokenCreate = (token: ERC20Token) => {
		setFormValues(prevState => ({...prevState, erc20TokenAddress: token.address}))
		setCreateTokenModalOpened(false)
	}
	const handleSubmit = () => {
		if (!submitButtonDisabled) {
			onSubmit(strategy, formValues)
		}
	}

	const handleChange = ({target: {name, value}}: ChangeEvent<HTMLInputElement>) => {
		setFormValues(prevState => ({...prevState, [name]: value}))
	}

	const submitButtonDisabled = !(
		delay &&
		!isNaN(Number(delay)) &&
		quorumThreshold &&
		!isNaN(Number(quorumThreshold)) &&
		Number(quorumThreshold) > 0 && // TODO: validation
		votingPeriod &&
		!isNaN(Number(votingPeriod)) &&
		signer
	)

	return (
		<>
			{createTokenModalOpened && (
				<CreateERC20TokenModal
					onSubmit={handleTokenCreate}
					onClose={() => {
						setCreateTokenModalOpened(false)
					}}
				/>
			)}
			<Modal show onClose={onClose} title="Deploy Strategy">
				<form className="voting-strategy-form" onSubmit={handleSubmit}>
					<h3>{subTitle}</h3>
					{strategy !== "singleVotingSimpleMembership" && (
						<div className="voting-strategy-form__row">
							<label>ERC-20 Token Address</label>
							<Input
								required
								name="erc20TokenAddress"
								value={formValues.erc20TokenAddress}
								onChange={handleChange}
							/>
							<div className="voting-strategy-form__create-token">
								<span>{`Don't have ERC-20 token yet?`}</span>
								<Button
									buttonType="link"
									onClick={event => {
										event.preventDefault()
										setCreateTokenModalOpened(true)
									}}
								>
									Create
								</Button>
							</div>
						</div>
					)}
					<div className="voting-strategy-form__row">
						<div className="voting-strategy-form__col">
							<label>Voting Period</label>
							<Input
								required
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
								required
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
							required
							placeholder="% of tokens"
							name="quorumThreshold"
							value={formValues.quorumThreshold}
							onChange={handleChange}
						/>
					</div>
					{strategy === "linearVotingSimpleMembershipZodiacExitModule" && (
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
					<Button type="submit" disabled={submitButtonDisabled} onClick={handleSubmit}>
						Submit
					</Button>
				</form>
			</Modal>
		</>
	)
}

export default DeployVotingStrategyModal
