import {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import {BuiltVotingStrategy} from "../../../types/DAO"
import EthersContext from "../../../context/EthersContext"
import Modal from "../Modal"
import Input from "../../Controls/Input"
import Button from "../../Controls/Button"
import getOZLinearDeployTx from "../../../api/ethers/functions/Seele/getOZLinearDeployTx"
import CreateERC20TokenModal from "../CreateERC20TokenModal"
import {ERC20Token} from "../../../types/ERC20Token"

const DeployLinearVotingStrategyModal: FunctionComponent<{
	gnosisAddress: string
	onSubmit: (strategy: BuiltVotingStrategy) => void
	onClose: () => void
}> = ({gnosisAddress, onClose, onSubmit}) => {
	const [createTokenModalOpened, setCreateTokenModalOpened] = useState(false)
	const {signer} = useContext(EthersContext)
	const [delay, setDelay] = useState("")
	const [tokenAddress, setTokenAddress] = useState("")
	const [quorumThreshold, setQuorumThreshold] = useState("")
	const [votingPeriod, setVotingPeriod] = useState("")

	const handleQuorumThresholdChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setQuorumThreshold("0")
		} else {
			setQuorumThreshold(e.target.value)
		}
	}

	const handleDelayChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setDelay("0")
		} else {
			setDelay(e.target.value)
		}
	}

	const handleVotingPeriodChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setVotingPeriod("0")
		} else {
			setVotingPeriod(e.target.value)
		}
	}

	const handleTokenCreate = (token: ERC20Token) => {
		setTokenAddress(token.address)
		setCreateTokenModalOpened(false)
	}

	const handleSubmit = async () => {
		if (
			delay &&
			!isNaN(Number(delay)) &&
			quorumThreshold &&
			!isNaN(Number(quorumThreshold)) &&
			Number(quorumThreshold) > 1 && // TODO: validation
			votingPeriod &&
			!isNaN(Number(votingPeriod)) &&
			signer
		) {
			const {tx, expectedAddress} = getOZLinearDeployTx(
				gnosisAddress,
				tokenAddress,
				Number(quorumThreshold),
				Number(delay),
				Number(votingPeriod),
				"DeployLinear",
				signer
			)
			onSubmit({
				strategy: "linearVotingCompoundBravo",
				tx,
				expectedAddress
			})
		}
	}

	const submitButtonDisabled = !(
		delay &&
		!isNaN(Number(delay)) &&
		!isNaN(Number(quorumThreshold)) &&
		quorumThreshold
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
			<Modal show onClose={onClose} width={700}>
				<div className="deploy-voting-strategy">
					<h2>Deploy ERC-20 Linear Voting Strategy</h2>
					<div className="deploy-voting-strategy__row">
						<div className="deploy-voting-strategy__col">
							<label className="no-margin">ERC-20 Token Address</label>
						</div>
						<div className="deploy-voting-strategy__col">
							<Input
								value={tokenAddress}
								onChange={e => {
									setTokenAddress(e.target.value)
								}}
							/>
						</div>
					</div>
					<Button
						buttonType="link"
						onClick={() => {
							setCreateTokenModalOpened(true)
						}}
					>
						Create token
					</Button>
					<div className="deploy-voting-strategy__row">
						<div className="deploy-voting-strategy__col">
							<label className="no-margin">Delay</label>
						</div>
						<div className="deploy-voting-strategy__col">
							<Input value={delay} onChange={handleDelayChange} number min={1} />
						</div>
					</div>
					<div className="deploy-voting-strategy__row">
						<div className="deploy-voting-strategy__col">
							<label className="no-margin">Quorum Threshold</label>
						</div>
						<div className="deploy-voting-strategy__col">
							<Input
								value={quorumThreshold}
								onChange={handleQuorumThresholdChange}
								number
								min={1}
							/>
						</div>
					</div>
					<div className="deploy-voting-strategy__row">
						<div className="deploy-voting-strategy__col">
							<label className="no-margin">Voting Period</label>
						</div>
						<div className="deploy-voting-strategy__col">
							<Input value={votingPeriod} onChange={handleVotingPeriodChange} number min={1} />
						</div>
					</div>
					<Button buttonType="primary" onClick={handleSubmit} disabled={submitButtonDisabled}>
						Submit
					</Button>
				</div>
			</Modal>
		</>
	)
}

export default DeployLinearVotingStrategyModal
