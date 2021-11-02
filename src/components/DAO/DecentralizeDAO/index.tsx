import {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import Input from "../../Controls/Input"
import Button from "../../Controls/Button"
import {AuthContext} from "../../../context/AuthContext"
import EthersContext from "../../../context/EthersContext"
import {toastError, toastSuccess} from "../../UI/Toast"
import addSafeProposal from "../../../api/firebase/safeProposal/addSafeProposal"
import {
	executeRegisterSeele,
	signRegisterSeele
} from "../../../api/ethers/functions/Seele/registerSeele"
import editDAO from "../../../api/firebase/DAO/editDAO"
import getOZLinearDeployTx from "../../../api/ethers/functions/Seele/getOZLinearDeployTx"
import getSeeleDeploy from "../../../api/ethers/functions/Seele/getSeeleDeploy"
import getOZLinearSetSeele from "../../../api/ethers/functions/Seele/getOZLinearSetSeele"
import getRegisterSeeleTx from "../../../api/ethers/functions/Seele/getRegisterSeeleTx"
import {
	buildMultiSendTx,
	executeMultiSend,
	signMultiSend
} from "../../../api/ethers/functions/Seele/multiSend"

const DecentralizeDAO: FunctionComponent<{
	gnosisAddress: string
	afterCreate: () => void
	tokenAddress: string
	gnosisVotingThreshold: number
}> = ({gnosisAddress, afterCreate, gnosisVotingThreshold, tokenAddress}) => {
	const {account} = useContext(AuthContext)
	const {signer} = useContext(EthersContext)
	const [loading, setLoading] = useState(false)
	const [delay, setDelay] = useState("")
	const [quorumThreshold, setQuorumThreshold] = useState("")
	const [votingPeriod, setVotingPeriod] = useState("")

	const handleSubmit = async () => {
		if (
			delay &&
			!isNaN(Number(delay)) &&
			quorumThreshold &&
			!isNaN(Number(quorumThreshold)) &&
			votingPeriod &&
			!isNaN(Number(votingPeriod)) &&
			signer &&
			account
		) {
			setLoading(true)
			try {
				const [deployLinearTx, expectedLinearAddress] = await getOZLinearDeployTx(
					gnosisAddress,
					tokenAddress,
					Number(quorumThreshold),
					Number(delay),
					Number(votingPeriod),
					"DeployLinear",
					signer
				)
				const [deploySeeleTx, expectedSeeleAddress] = await getSeeleDeploy(
					gnosisAddress,
					[expectedLinearAddress],
					signer
				)
				const ozLinearSetSeeleTx = await getOZLinearSetSeele(
					expectedSeeleAddress,
					expectedLinearAddress,
					signer
				)
				const registerSeeleTx = await getRegisterSeeleTx(
					gnosisAddress,
					expectedSeeleAddress,
					signer
				)
				const multiTx = await buildMultiSendTx(
					[deployLinearTx, deploySeeleTx, ozLinearSetSeeleTx, registerSeeleTx],
					gnosisAddress,
					signer
				)
				console.log("multiTx: ", multiTx)
				const signature = await signMultiSend(multiTx, gnosisAddress, signer)
				console.log("signature: ", signature)
				if (gnosisVotingThreshold === 1) {
					await executeMultiSend(multiTx, gnosisAddress, [signature], signer)
					console.log("HURRAY")
					await editDAO({
						gnosisAddress,
						seeleAddress: expectedSeeleAddress
					})
				}
				await addSafeProposal({
					type: "decentralizeDAO",
					gnosisAddress,
					seeleAddress: expectedSeeleAddress,
					title: "Decentralize DAO",
					state: gnosisVotingThreshold === 1 ? "executed" : "active",
					signatures: [signature],
					multiTx
				})
				afterCreate()
				toastSuccess(
					gnosisVotingThreshold === 1
						? "DAO successfully decentralized"
						: "Decentralization proposal successfully created"
				)
			} catch (e) {
				console.error(e)
				toastError("Failed to create DAO")
			}
			setLoading(false)
		}
	}

	const handleQuorumThresholdChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setQuorumThreshold("0")
		} else {
			setQuorumThreshold(e.target.value)
		}
	}

	const handleDelayChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setDelay("0")
		} else {
			setDelay(e.target.value)
		}
	}

	const handleVotingPeriodChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setVotingPeriod("0")
		} else {
			setVotingPeriod(e.target.value)
		}
	}

	const submitButtonDisabled = !(
		delay &&
		!isNaN(Number(delay)) &&
		!isNaN(Number(quorumThreshold)) &&
		quorumThreshold
	)

	return (
		<>
			<h2>{`Decentralize DAO`}</h2>
			<p>{`Step 2. Add general DAO parameters.`}</p>
			<div className="decentralize-dao__row">
				<div className="decentralize-dao__col">
					<label className="no-margin">Delay</label>
				</div>
				<div className="decentralize-dao__col">
					<Input borders="all" value={delay} onChange={handleDelayChange} number min={1} />
				</div>
			</div>
			<div className="decentralize-dao__row">
				<div className="decentralize-dao__col">
					<label className="no-margin">Quorum Threshold</label>
				</div>
				<div className="decentralize-dao__col">
					<Input
						borders="all"
						value={quorumThreshold}
						onChange={handleQuorumThresholdChange}
						number
						min={1}
					/>
				</div>
			</div>
			<div className="decentralize-dao__row">
				<div className="decentralize-dao__col">
					<label className="no-margin">Voting Period</label>
				</div>
				<div className="decentralize-dao__col">
					<Input
						borders="all"
						value={votingPeriod}
						onChange={handleVotingPeriodChange}
						number
						min={1}
					/>
				</div>
			</div>
			<Button
				buttonType="primary"
				onClick={handleSubmit}
				disabled={submitButtonDisabled || loading}
			>
				{loading ? "Processing..." : "Submit"}
			</Button>
		</>
	)
}

export default DecentralizeDAO
