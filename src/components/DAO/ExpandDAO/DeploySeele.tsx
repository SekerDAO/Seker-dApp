import {FunctionComponent, useState} from "react"
import Stepper from "../../UI/Stepper"
import Paper from "../../UI/Paper"
import Divider from "../../UI/Divider"
import VotingStrategyCard from "./VotingStrategyCard"
import {SeeleVotingStrategy} from "../../../types/seele"
import {toastWarning} from "../../UI/Toast"
import Button from "../../Controls/Button"
import {ReactComponent as WarningIcon} from "../../../assets/icons/warning.svg"

const DeploySeele: FunctionComponent = () => {
	const [currentStep, setCurrentStep] = useState<number>(0)
	const [votingStrategy, setVotingStrategy] = useState<SeeleVotingStrategy>()

	const handleStepClick = (stepIndex: number) => {
		setCurrentStep(stepIndex)
	}

	const handleSelectVotingStrategy = (newVotingStrategy: SeeleVotingStrategy) => {
		if (newVotingStrategy !== "singleVoting") {
			toastWarning(
				"This voting strategy is not implemented yet. We're actively working on bringing it to live"
			)
			return
		}
		setVotingStrategy(newVotingStrategy)
	}

	const StepContentWrapper: FunctionComponent = ({children}) => (
		<Paper className="deploy-seele__step-content">{children}</Paper>
	)

	const steps = [
		{
			title: "Choose Voting Strateg(ies)",
			content: (
				<>
					<p className="deploy-seele__step-description">
						Determine which voting strateg(ies) best fit your DAO’s decision-making process, set up
						the required parameters to each, and add the strateg(ies) to the deployment queue. You
						can add as many as you would like. Once you have finished, proceed to the next step to
						confirm your transactions and deploy.
					</p>
					<Divider />
					<div className="deploy-seele__voting-strategy-row">
						<VotingStrategyCard
							title="Single Voting"
							description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna."
							votingStrategy="singleVoting"
							onSelect={handleSelectVotingStrategy}
						/>
					</div>
					<div className="deploy-seele__warning-message-container">
						<div>
							<WarningIcon width="20px" height="20px" />
						</div>
						<p className="deploy-seele__warning-message-text">
							The following strategies require your DAO to have an ERC-20 token before deploying.
							Follow the initial steps in the modal to create / load one. To learn more about the
							required ERC-20 tokens, click <a>here</a>.
						</p>
					</div>
					<div className="deploy-seele__voting-strategy-row">
						<VotingStrategyCard
							title="Linear Voting with Delegration"
							description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna."
							votingStrategy="linearVotingWithDelegation"
							onSelect={handleSelectVotingStrategy}
						/>
						<VotingStrategyCard
							title="Quadratic Voting"
							description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna."
							votingStrategy="quadraticVoting"
							onSelect={handleSelectVotingStrategy}
						/>
						<VotingStrategyCard
							title="Conviction Voting (Common Stack)"
							description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna."
							votingStrategy="convictionVoting"
							onSelect={handleSelectVotingStrategy}
						/>
					</div>
					<div className="deploy-seele__next-step-btn">
						<Button buttonType="link" onClick={() => setCurrentStep(1)}>
							Continue to Next Step
						</Button>
					</div>
				</>
			)
		},
		{
			title: "Confirm Deployment",
			content: <Paper>Hello there</Paper>
		},
		{title: "Pass Proposal", content: <Paper>Hello there</Paper>},
		{title: "Finalize Deployment", content: <Paper>Hello there</Paper>}
	]

	return (
		<div className="deploy-seele">
			<Stepper
				steps={steps}
				currentStepIndex={currentStep}
				onStepClick={handleStepClick}
				StepContentWrapper={StepContentWrapper}
			/>
		</div>
	)
}

export default DeploySeele
