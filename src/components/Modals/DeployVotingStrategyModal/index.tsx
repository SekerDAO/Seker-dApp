import {isAddress} from "@ethersproject/address"
import {ChangeEvent, FunctionComponent, useContext, useEffect, useState} from "react"
import checkErc20Wrapped from "../../../api/ethers/functions/ERC20Token/checkErc20Wrapped"
import {VOTING_STRATEGIES} from "../../../constants/votingStrategies"
import {AuthContext} from "../../../context/AuthContext"
import {ProviderContext} from "../../../context/ProviderContext"
import {VotingStrategyName} from "../../../types/DAO"
import {ERC20Token} from "../../../types/ERC20Token"
import Button from "../../Controls/Button"
import Input from "../../Controls/Input"
import CreateERC20TokenModal from "../CreateERC20TokenModal"
import Modal from "../Modal"
import "./styles.scss"

export type VotingStrategyFormValues = {
	tokenAddress: string
	votingPeriod: number
	delay: number
	quorumThreshold: number
}

const DeployVotingStrategyModal: FunctionComponent<{
	strategy: VotingStrategyName
	onSubmit: (strategy: VotingStrategyName, formValues: VotingStrategyFormValues) => void
	onClose: () => void
	sideChain: boolean
}> = ({strategy, onSubmit, onClose, sideChain}) => {
	const [createTokenModalOpened, setCreateTokenModalOpened] = useState(false)
	const {signer} = useContext(AuthContext)
	const {provider, sideChainProvider} = useContext(ProviderContext)

	const [tokenAddress, setTokenAddress] = useState("")
	const [tokenAddressValidation, setTokenAddressValidation] = useState<string | null>(null)

	useEffect(() => {
		if (tokenAddress) {
			if (isAddress(tokenAddress)) {
				checkErc20Wrapped(tokenAddress, sideChain ? sideChainProvider : provider).then(res => {
					if (res) {
						setTokenAddressValidation(null)
					} else {
						setTokenAddressValidation("Token not wrapped")
					}
				})
			} else {
				setTokenAddressValidation("Not a valid address")
			}
		} else {
			setTokenAddressValidation(null)
		}
	}, [tokenAddress])
	const [votingPeriod, setVotingPeriod] = useState("")
	const [delay, setDelay] = useState("")
	const [quorumThreshold, setQuorumThreshold] = useState("")

	const handleTokenCreate = (token: ERC20Token) => {
		setTokenAddress(token.address)
		setCreateTokenModalOpened(false)
	}

	const handleSubmit = () => {
		if (!submitButtonDisabled) {
			onSubmit(strategy, {
				tokenAddress,
				delay: Number(delay),
				votingPeriod: Number(votingPeriod),
				quorumThreshold: Number(quorumThreshold)
			})
		}
	}

	const handleQuorumThresholdChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) > 100) {
			setQuorumThreshold("100")
		} else {
			setQuorumThreshold(e.target.value)
		}
	}

	const submitButtonDisabled = !(
		delay &&
		!isNaN(Number(delay)) &&
		quorumThreshold &&
		!isNaN(Number(quorumThreshold)) &&
		Number(quorumThreshold) > 0 && // TODO: validation
		votingPeriod &&
		!isNaN(Number(votingPeriod)) &&
		Number(votingPeriod) > 1 &&
		signer &&
		tokenAddress &&
		!tokenAddressValidation
	)

	return (
		<>
			{createTokenModalOpened && (
				<CreateERC20TokenModal
					onSubmit={handleTokenCreate}
					onClose={() => {
						setCreateTokenModalOpened(false)
					}}
					sideChain={sideChain}
				/>
			)}
			<Modal show onClose={onClose} title="Deploy Strategy">
				<div className="voting-strategy-form">
					<h3>
						{VOTING_STRATEGIES.find(votingStrategy => votingStrategy.strategy === strategy)?.title}
					</h3>
					{strategy === "linearVoting" && (
						<div className="voting-strategy-form__row">
							<label>ERC-20 Token Address</label>
							<Input
								required
								name="erc20TokenAddress"
								value={tokenAddress}
								onChange={e => {
									setTokenAddress(e.target.value)
								}}
								validation={tokenAddressValidation}
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
								min={2}
								placeholder="# of hours"
								name="votingPeriod"
								value={votingPeriod}
								onChange={e => {
									setVotingPeriod(e.target.value)
								}}
							/>
						</div>
						<div className="voting-strategy-form__col">
							<label>Time Delay</label>
							<Input
								required
								number
								min={0}
								placeholder="# of hours"
								name="delay"
								value={delay}
								onChange={e => {
									setDelay(e.target.value)
								}}
							/>
						</div>
					</div>
					<div className="voting-strategy-form__row">
						<label>Quorum Threshold</label>
						<Input
							number
							required
							min={1}
							max={100}
							placeholder="% of tokens"
							name="quorumThreshold"
							value={quorumThreshold}
							onChange={handleQuorumThresholdChange}
						/>
					</div>
					<Button disabled={submitButtonDisabled} onClick={handleSubmit}>
						Submit
					</Button>
				</div>
			</Modal>
		</>
	)
}

export default DeployVotingStrategyModal
