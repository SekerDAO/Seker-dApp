import {useState, useEffect, useContext} from "react"
import getERC20Balance from "../../../../api/ethers/functions/ERC20Token/getERC20Balance"
import {checkDelegatee, delegateVote} from "../../../../api/ethers/functions/Usul/voting/votingApi"
import {AuthContext} from "../../../../context/AuthContext"
import ProviderContext from "../../../../context/ProviderContext"
import {VotingStrategy} from "../../../../types/DAO"
import {toastError, toastSuccess} from "../../../UI/Toast"

type DelegateTo = "self" | "address"
const useDelegateTokenModal = ({
	strategy,
	govTokenAddress,
	onClose
}: {
	strategy: VotingStrategy
	govTokenAddress?: string
	onClose: () => void
}): {
	processing: boolean
	submitButtonDisabled: boolean
	handleSubmit: () => Promise<void>
	handleDelegateToChange: (newValue: DelegateTo) => void
	handleDelegateeAddressChange: (newValue: string) => void
	delegateTo: DelegateTo
	delegateeAddress?: string
	initialDelegateeAddress?: string
	tokensAmount?: number
} => {
	const {signer, account} = useContext(AuthContext)
	const {provider} = useContext(ProviderContext)
	const [processing, setProcessing] = useState(false)
	const [delegateTo, setDelegateTo] = useState<DelegateTo>("self")
	const [initialDelegateeAddress, setInitialDelegateeAddress] = useState<string>()
	const [delegateeAddress, setDelegateeAddress] = useState<string>()
	const [tokensAmount, setTokensAmount] = useState<number>()
	const submitButtonDisabled =
		processing || !signer || (delegateTo === "address" && !delegateeAddress)

	useEffect(() => {
		if (govTokenAddress && account) {
			checkDelegatee(govTokenAddress, account, provider).then(delegatee => {
				if (delegatee) {
					setInitialDelegateeAddress(delegatee)
				}
			})
			getERC20Balance(govTokenAddress, account, provider).then(balance => {
				if (balance) {
					setTokensAmount(balance)
				}
			})
		}
	}, [strategy, account])
	const handleSubmit = async () => {
		if (!signer || !govTokenAddress || !account) return
		setProcessing(true)
		try {
			if (delegateTo === "self") {
				await delegateVote(govTokenAddress, account, signer)
			} else {
				if (delegateeAddress) {
					await delegateVote(govTokenAddress, delegateeAddress, signer)
				}
			}
			toastSuccess("Tokens successfully delegated")
			setProcessing(false)
			onClose()
		} catch (e) {
			console.error(e)
			toastError("Failed to delegate tokens")
			setProcessing(false)
		}
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
		handleDelegateeAddressChange,
		tokensAmount
	}
}

export default useDelegateTokenModal
