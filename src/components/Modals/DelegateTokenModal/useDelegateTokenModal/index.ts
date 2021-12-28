import {useState, useEffect, useContext} from "react"
import {getStrategyGovTokenAddress} from "../../../../api/ethers/functions/Usul/voting/usulStrategies"
import {checkDelegatee, delegateVote} from "../../../../api/ethers/functions/Usul/voting/votingApi"
import {AuthContext} from "../../../../context/AuthContext"
import ProviderContext from "../../../../context/ProviderContext"
import {VotingStrategy} from "../../../../types/DAO"
import {toastError, toastSuccess} from "../../../UI/Toast"

type DelegateTo = "self" | "address"
const useDelegateTokenModal = (
	strategy: VotingStrategy
): {
	processing: boolean
	submitButtonDisabled: boolean
	handleSubmit: () => Promise<void>
	handleDelegateToChange: (newValue: DelegateTo) => void
	handleDelegateeAddressChange: (newValue: string) => void
	delegateTo: DelegateTo
	delegateeAddress?: string
	initialDelegateeAddress?: string
} => {
	const {signer, account} = useContext(AuthContext)
	const {provider} = useContext(ProviderContext)
	const [processing, setProcessing] = useState(false)
	const [delegateTo, setDelegateTo] = useState<DelegateTo>("self")
	const [initialDelegateeAddress, setInitialDelegateeAddress] = useState<string>()
	const [delegateeAddress, setDelegateeAddress] = useState<string>()
	const [govTokenAddress, setGovTokenAddress] = useState<string>()
	const submitButtonDisabled = processing || !signer || (delegateTo === "self" && !delegateeAddress)

	useEffect(() => {
		getStrategyGovTokenAddress(strategy.address, provider).then(tokenAddress => {
			if (tokenAddress) {
				setGovTokenAddress(tokenAddress)
			}
		})
	}, [strategy.address])
	useEffect(() => {
		if (govTokenAddress && account) {
			checkDelegatee(govTokenAddress, account, provider).then(delegatee => {
				if (delegatee) {
					setInitialDelegateeAddress(delegatee)
				}
			})
		}
	}, [strategy, account])
	const handleSubmit = async () => {
		if (!signer || !govTokenAddress || !account) return
		try {
			if (delegateTo === "self") {
				await delegateVote(govTokenAddress, account, signer)
			} else {
				if (delegateeAddress) {
					await delegateVote(govTokenAddress, delegateeAddress, signer)
				}
			}
			toastSuccess("Tokens successfully delegated")
		} catch (e) {
			console.error(e)
			toastError("Failed to delegate tokens")
		}
		setProcessing(false)
	}
	const handleDelegateToChange = (newValue: DelegateTo) => {
		setDelegateTo(newValue)
	}
	const handleDelegateeAddressChange = (newValue: string) => {
		setDelegateeAddress(newValue)
	}

	return {
		handleSubmit,
		submitButtonDisabled,
		processing,
		delegateTo,
		delegateeAddress,
		initialDelegateeAddress,
		handleDelegateToChange,
		handleDelegateeAddressChange
	}
}

export default useDelegateTokenModal
