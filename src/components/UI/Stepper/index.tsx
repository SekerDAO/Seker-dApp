import {FunctionComponent} from "react"
import {ReactComponent as StepDotNextIcon} from "../../../assets/icons/step-dot-next.svg"
import {ReactComponent as StepDotCurrentIcon} from "../../../assets/icons/step-dot-current.svg"
import {ReactComponent as StepDotDoneIcon} from "../../../assets/icons/step-dot-done.svg"
import "./styles.scss"

const Stepper: FunctionComponent<{
	steps: string[]
	currentStepIndex: number
	onStepClick: (stepId: number) => void
}> = ({steps, currentStepIndex, onStepClick}) => {
	return (
		<div className="stepper">
			{steps.map((step, index) => {
				const stepDone = index < currentStepIndex
				const isCurrentStep = index === currentStepIndex
				return (
					<div
						key={index}
						onClick={() => onStepClick(index)}
						className={`stepper__step${
							stepDone ? " stepper__step--done" : isCurrentStep ? " stepper__step--current" : ""
						}`}
					>
						<h3>{step}</h3>
						{stepDone ? (
							<StepDotDoneIcon width="20px" height="20px" />
						) : isCurrentStep ? (
							<StepDotCurrentIcon width="20px" height="20px" />
						) : (
							<StepDotNextIcon width="20px" height="20px" />
						)}
					</div>
				)
			})}
		</div>
	)
}

export default Stepper
