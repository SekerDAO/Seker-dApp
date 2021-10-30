import {FunctionComponent, useState} from "react"
import Stepper from "../../UI/Stepper"

const DeploySeele: FunctionComponent = () => {
	const [currentStep, setCurrentStep] = useState<number>(0)
	const steps = [
		"Choose Voting Strategy",
		"Confirm Deployment",
		"Pass Proposal",
		"Finalize Deployment"
	]

	const handleStepClick = (stepIndex: number) => {
		setCurrentStep(stepIndex)
	}

	return (
		<div className="deploy-seele">
			<Stepper steps={steps} currentStepIndex={currentStep} onStepClick={handleStepClick} />
		</div>
	)
}

export default DeploySeele
