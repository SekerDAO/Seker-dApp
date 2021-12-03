import {FunctionComponent, useMemo} from "react"
import {useLocation} from "react-router-dom"
import {ReactComponent as DelegateTokenDone} from "../../../assets/icons/delegate-token-done.svg"
import {ReactComponent as WarningIcon} from "../../../assets/icons/warning.svg"
import {ReactComponent as WrapTokenDone} from "../../../assets/icons/wrap-token-done.svg"
import useSafeProposal from "../../../hooks/getters/useSafeProposal"
import useStrategyProposal from "../../../hooks/getters/useStrategyProposal"
import {formatReadableAddress} from "../../../utlls"
import Button from "../../Controls/Button"
import useSignSafeProposal from "../../Proposal/hooks/useSignSafeProposal"
import Copy from "../../UI/Copy"
import Divider from "../../UI/Divider"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import Loader from "../../UI/Loader"
import ProposalLayout from "./ProposalLayout"
import "./styles.scss"

const MOCK_ADDRESS = "0xF6690149C78D0254EF65FDAA6B23EC6A342f6d8D"

const SafeProposalContent: FunctionComponent<{id: string}> = ({id}) => {
	const {proposal, loading, error, canSign} = useSafeProposal(id)
	const {sign, processing} = useSignSafeProposal({proposal, canSign, id})

	if (loading || !proposal) return <Loader />
	if (error) return <ErrorPlaceholder />

	return (
		<ProposalLayout
			proposal={proposal}
			votingStrategy="admin"
			votesThreshold={proposal.gnosisVotingThreshold}
		>
			<Button
				disabled={!canSign || processing}
				onClick={sign}
				extraClassName="proposal__content-vote-button"
			>
				Sign
			</Button>
			<div className="proposal__content-participate-warning">
				<div>
					<WarningIcon width="20px" height="20px" />
				</div>
				<p>
					{`This request will incur a gas fee. If you would like to proceed, please
												click "Confirm".`}
				</p>
			</div>
		</ProposalLayout>
	)
}

const StrategyProposalContent: FunctionComponent<{id: string}> = ({id}) => {
	const {proposal, loading, error} = useStrategyProposal(id)

	if (loading || !proposal) return <Loader />
	if (error) return <ErrorPlaceholder />

	return (
		<ProposalLayout proposal={proposal} votesThreshold={100} votingStrategy={proposal.strategyType}>
			<div>
				<WrapTokenDone width="50px" height="50px" />
			</div>
			<div className="proposal__content-participate-step">
				<h3>Step 1: Wrap Tokens</h3>
				<p>Wrapped Token Address</p>
				<Copy value="TODO: Add real token address here">{formatReadableAddress(MOCK_ADDRESS)}</Copy>
				<Button buttonType="link">Unwrap Tokens</Button>
			</div>
			<Divider />
			<div>
				<DelegateTokenDone width="50px" height="50px" />
			</div>
			<div className="proposal__content-participate-step">
				<h3>Step 2: Delegate</h3>
				<p>Currently Delegated to</p>
				<Copy value="TODO: Add delegated user address here">
					{formatReadableAddress(MOCK_ADDRESS)}
				</Copy>
				<Button buttonType="link">Change Delegation</Button>
			</div>
			<Divider />
			<Button>Vote</Button>
		</ProposalLayout>
	)
}

const Proposal: FunctionComponent = () => {
	const {search} = useLocation()
	const {id, type} = useMemo(() => {
		const params = new URLSearchParams(search)
		return {
			id: params.get("id"),
			type: params.get("type")
		}
	}, [search]) as {
		id: string
		type: string
	}

	return type === "safe" ? <SafeProposalContent id={id} /> : <StrategyProposalContent id={id} />
}

export default Proposal
