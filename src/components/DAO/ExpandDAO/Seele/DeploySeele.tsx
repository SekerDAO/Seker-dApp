import {FunctionComponent, useState, useRef} from "react"
import Paper from "../../../UI/Paper"
import Divider from "../../../UI/Divider"
import VotingStrategyCard, {VOTING_STRATEGIES_CONTENT} from "./VotingStrategyCard"
import VotingStrategyModal from "./VotingStrategyModal"
import {SeeleVotingStrategy} from "../../../../types/seele"
import {toastWarning} from "../../../UI/Toast"
import Button from "../../../Controls/Button"
import useClickOutside from "../../../../hooks/useClickOutside"
import {ReactComponent as WarningIcon} from "../../../../assets/icons/warning.svg"
import {ReactComponent as StepDotDoneIcon} from "../../../../assets/icons/step-dot-done.svg"
import "./styles.scss"

const DeploySeele: FunctionComponent<{onReturnToExpandDAO: () => void}> = ({
	onReturnToExpandDAO
}) => {
	const ref = useRef<HTMLDivElement | null>(null)
	const [currentStep, setCurrentStep] = useState<"selectVotingStrategies" | "confirm">(
		"selectVotingStrategies"
	)
	const [activeVotingStrategyModal, setActiveVotingStrategyModal] = useState<SeeleVotingStrategy>()
	const [votingStrategies, setVotingStrategies] = useState<SeeleVotingStrategy[]>([])

	const handleSelectVotingStrategy = (newVotingStrategy: SeeleVotingStrategy) => {
		if (newVotingStrategy !== "singleVoting") {
			toastWarning(
				"This voting strategy is not implemented yet. We're actively working on bringing it to live"
			)
			return
		}
		setVotingStrategies(prevState => [...prevState, newVotingStrategy])
	}

	const handleVotingStrategyCardClick = (votingStrategy: SeeleVotingStrategy) => {
		setActiveVotingStrategyModal(votingStrategy)
	}
	const handleModalClose = () => setActiveVotingStrategyModal(undefined)

	useClickOutside(ref, handleModalClose)

	return (
		<Paper className="deploy-seele" ref={ref}>
			{currentStep === "selectVotingStrategies" && (
				<>
					<div className="deploy-seele__voting-strategies">
						<h2>Voting Strategies</h2>
						<div className="deploy-seele__voting-strategy-row">
							<VotingStrategyCard
								onClick={handleVotingStrategyCardClick}
								votingStrategy="singleVotingSimpleMembership"
								isActive
							/>
						</div>
						<div className="deploy-seele__warning-message">
							<WarningIcon width="22px" height="20px" />
							<span>The following strategies require your DAO to have an ERC-20 token.</span>
						</div>
						<div className="deploy-seele__voting-strategy-row">
							<VotingStrategyCard
								onClick={handleVotingStrategyCardClick}
								votingStrategy="singleVoting"
								isActive
							/>
							<VotingStrategyCard
								onClick={handleVotingStrategyCardClick}
								votingStrategy="linearVotingCompoundBravo"
								isActive
							/>
							<VotingStrategyCard
								onClick={handleVotingStrategyCardClick}
								votingStrategy="linearVotingSimpleMembership"
								isActive
							/>
						</div>
						<div className="deploy-seele__voting-strategy-row">
							<VotingStrategyCard
								onClick={handleVotingStrategyCardClick}
								votingStrategy="molochLinearVoting"
								isActive
							/>
							<VotingStrategyCard
								onClick={handleVotingStrategyCardClick}
								votingStrategy="quadraticVotingSimpleMembership"
								isActive
							/>
						</div>
					</div>
					<Divider type="vertical" />
					<div className="deploy-seele__bundle-transactions">
						<h2>Bundle Transactions</h2>
						{votingStrategies.map(votingStrategy => (
							<div key={votingStrategy}>
								<StepDotDoneIcon />
								<span>{VOTING_STRATEGIES_CONTENT[votingStrategy].title}</span>
							</div>
						))}
						<Button disabled={!votingStrategies.length} onClick={() => setCurrentStep("confirm")}>
							Continue
						</Button>
					</div>
					<VotingStrategyModal
						show={!!activeVotingStrategyModal}
						votingStrategy={activeVotingStrategyModal}
						onClose={handleModalClose}
					/>
				</>
			)}
		</Paper>
	)
}

export default DeploySeele
