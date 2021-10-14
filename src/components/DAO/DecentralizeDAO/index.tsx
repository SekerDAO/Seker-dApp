import {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import Input from "../../Controls/Input"
import Button from "../../Controls/Button"
import {AuthContext} from "../../../context/AuthContext"
import EthersContext from "../../../context/EthersContext"
import {toastError, toastSuccess} from "../../Toast"
import createProposalModule from "../../../api/ethers/functions/proposalModule/createProposalModule"
import {
	executeHookupProposalModule,
	signHookupProposalModule
} from "../../../api/ethers/functions/gnosisSafe/hookupProposalModule"
import addSafeProposal from "../../../api/firebase/safeProposal/addSafeProposal"
import createLinearVoting from "../../../api/ethers/functions/gnosisSafe/createLinearVoting"
import {
	executeHookupLinearVotingModule,
	signHookupLinearVotingModule
} from "../../../api/ethers/functions/proposalModule/hookupLinearVotingModule"

const DecentralizeDAO: FunctionComponent<{
	gnosisAddress: string
	afterCreate: () => void
	tokenAddress: string
	totalSupply: number
	gnosisVotingThreshold: number
}> = ({gnosisAddress, afterCreate, gnosisVotingThreshold, tokenAddress, totalSupply}) => {
	const {account} = useContext(AuthContext)
	const {signer} = useContext(EthersContext)
	const [loading, setLoading] = useState(false)
	const [proposalTime, setProposalTime] = useState("")
	const [votingThreshold, setVotingThreshold] = useState("")

	const handleSubmit = async () => {
		if (
			proposalTime &&
			!isNaN(Number(proposalTime)) &&
			votingThreshold &&
			!isNaN(Number(votingThreshold)) &&
			signer &&
			account
		) {
			setLoading(true)
			try {
				const daoAddress = await createProposalModule(
					gnosisAddress,
					Number(proposalTime),
					Number(votingThreshold),
					signer
				)
				// TODO: handle other voting modules
				const votingModule = await createLinearVoting(
					totalSupply,
					daoAddress,
					tokenAddress,
					Number(proposalTime),
					gnosisAddress,
					signer
				)
				const proposalHookupSignature = await signHookupProposalModule(
					gnosisAddress,
					daoAddress,
					signer
				)
				const votingHookupSignature = await signHookupLinearVotingModule(
					gnosisAddress,
					votingModule,
					daoAddress,
					signer
				)
				if (gnosisVotingThreshold === 1) {
					await executeHookupProposalModule(
						gnosisAddress,
						daoAddress,
						[proposalHookupSignature],
						signer
					)
					await executeHookupLinearVotingModule(
						gnosisAddress,
						votingModule,
						daoAddress,
						[votingHookupSignature],
						signer
					)
					// TODO: add new function for decentralize DAO
					// await editDAO({
					// 	gnosisAddress,
					// 	daoAddress,
					// 	tokenAddress,
					// 	totalSupply,
					// 	votingAddress: votingModule,
					// 	daoVotingThreshold: Number(votingThreshold)
					// })
				}
				await addSafeProposal({
					type: "decentralizeDAO",
					gnosisAddress,
					title: "Decentralize DAO",
					state: gnosisVotingThreshold === 1 ? "executed" : "active",
					gracePeriod: Number(proposalTime),
					daoVotingThreshold: Number(votingThreshold),
					signatures: [proposalHookupSignature],
					signaturesStep2: [votingHookupSignature]
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

	const handleVotingThresholdChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setVotingThreshold("0")
		} else {
			setVotingThreshold(e.target.value)
		}
	}

	const handleGracePeriodChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setProposalTime("0")
		} else {
			setProposalTime(e.target.value)
		}
	}

	const submitButtonDisabled = !(
		proposalTime &&
		!isNaN(Number(proposalTime)) &&
		!isNaN(Number(votingThreshold)) &&
		votingThreshold
	)

	return (
		<>
			<h2>{`Decentralize DAO`}</h2>
			<p>{`Step 2. Add general DAO parameters.`}</p>
			<div className="decentralize-dao__row">
				<div className="decentralize-dao__col">
					<label className="no-margin">Proposal Time</label>
				</div>
				<div className="decentralize-dao__col">
					<Input
						borders="all"
						value={proposalTime}
						onChange={handleGracePeriodChange}
						number
						min={1}
					/>
				</div>
			</div>
			<div className="decentralize-dao__row">
				<div className="decentralize-dao__col">
					<label className="no-margin">Voting Threshold</label>
				</div>
				<div className="decentralize-dao__col">
					<Input
						borders="all"
						value={votingThreshold}
						onChange={handleVotingThresholdChange}
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
