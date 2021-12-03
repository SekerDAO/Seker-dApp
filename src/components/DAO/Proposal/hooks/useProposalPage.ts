import {useState} from "react"
import {SafeProposal} from "../../../../types/safeProposal"
import {StrategyProposal} from "../../../../types/strategyProposal"
import {toastInfo} from "../../../UI/Toast"

const useProposalPage = (
	proposal: ((SafeProposal | StrategyProposal) & {proposalType: "admin" | "strategy"}) | null
): {
	showWrapModal: boolean
	showDelegateModal: boolean
	wrapTokenSuccess: boolean
	delegateTokenSuccess: boolean
	handleCloseWrapModal: () => void
	handleCloseDelegateModal: () => void
	handleCloseWrapTokenSuccessModal: () => void
	handleCloseDelegateTokenSuccessModal: () => void
	handleWrapToken: (tokensAmount: number) => void
	handleDelegateToken: (delegateesAddress: string) => void
	handleOpenWrapModal: () => void
	handleOpenDelegateModal: () => void
	tokensWrapped: boolean
	voteDelegated: boolean
	isExecuted: boolean
	isAdminProposal: boolean
} => {
	const isExecuted = proposal?.state === "executed"
	const isAdminProposal = proposal?.proposalType === "admin"
	// TODO: Identify tokens being wrapped
	const tokensWrapped = false
	// TODO: Identify vote being delegated
	const voteDelegated = false
	const [showWrapModal, setShowWrapModal] = useState(false)
	const [showDelegateModal, setShowDelegateModal] = useState(false)
	const [wrapTokenSuccess, setWrapTokenSuccess] = useState(false)
	const [delegateTokenSuccess, setDelegateTokenSuccess] = useState(false)

	const handleOpenWrapModal = () => {
		setShowWrapModal(true)
	}

	const handleOpenDelegateModal = () => {
		setShowDelegateModal(true)
	}

	const handleCloseWrapModal = () => {
		setShowWrapModal(false)
	}

	const handleCloseDelegateModal = () => {
		setShowDelegateModal(false)
	}

	const handleWrapToken = (tokensAmount: number) => {
		setWrapTokenSuccess(true)
		toastInfo("This functionality is not yet implemented. We're working hard on making it live!")
	}

	const handleDelegateToken = (delegateesAddress: string) => {
		setDelegateTokenSuccess(true)
		toastInfo("This functionality is not yet implemented. We're working hard on making it live!")
	}

	const handleCloseWrapTokenSuccessModal = () => {
		setShowWrapModal(false)
		setWrapTokenSuccess(false)
	}
	const handleCloseDelegateTokenSuccessModal = () => {
		setShowDelegateModal(false)
		setDelegateTokenSuccess(false)
	}

	return {
		showWrapModal,
		showDelegateModal,
		wrapTokenSuccess,
		delegateTokenSuccess,
		handleCloseWrapModal,
		handleCloseDelegateModal,
		handleCloseWrapTokenSuccessModal,
		handleCloseDelegateTokenSuccessModal,
		handleWrapToken,
		handleDelegateToken,
		handleOpenWrapModal,
		handleOpenDelegateModal,
		tokensWrapped,
		voteDelegated,
		isExecuted,
		isAdminProposal
	}
}

export default useProposalPage
