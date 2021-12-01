import {FunctionComponent, useState} from "react"
import Input from "../../Controls/Input"
import Modal from "../Modal"

const WrapTokenModal: FunctionComponent<{
	mode: "wrap" | "unwrap"
	show: boolean
	onClose: () => void
	tokensHeld: number
	onSubmit: (tokensAmout: number) => void
}> = ({mode, show, onClose, tokensHeld, onSubmit}) => {
	const isWrap = mode === "wrap"
	const [tokensAmount, setTokensAmout] = useState<string>()
	const handleSubmit = () => {
		onSubmit(Number(tokensAmount))
	}
	return (
		<Modal
			onSubmit={handleSubmit}
			submitButtonText="Submit"
			submitButtonDisabled={!tokensAmount}
			onClose={onClose}
			show={show}
			title={isWrap ? "Wrap Tokens" : "Unwrap Tokens"}
			warningMessage={`This request will incur a gas fee. If you would like to proceed, please click "Submit" below.`}
		>
			<label htmlFor="tokens-amount">Amount of Tokens You Hold: {tokensHeld}</label>
			<Input
				max={tokensAmount}
				min={0}
				number
				id="tokens-amount"
				name="wrap-tokens-amount"
				value={tokensAmount}
				onChange={e => setTokensAmout(e.target.value)}
			/>
		</Modal>
	)
}

export default WrapTokenModal
