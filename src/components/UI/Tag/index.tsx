import {FunctionComponent} from "react"
import {SafeProposalState} from "../../../types/safeProposal"
import {StrategyProposalState} from "../../../types/strategyProposal"
import "./styles.scss"

const Tag: FunctionComponent<{
	variant: StrategyProposalState | SafeProposalState
}> = ({children, variant}) => <span className={`tag tag--${variant}`}>{children}</span>

export default Tag
