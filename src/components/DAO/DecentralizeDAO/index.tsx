import React, {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import Input from "../../Controls/Input"
import RadioButton from "../../Controls/RadioButton"
import Button from "../../Controls/Button"
import {AuthContext} from "../../../context/AuthContext"
import {DAODecisionMakingSpeed} from "../../../types/DAO"
import EthersContext from "../../../context/EthersContext"
import {toastError} from "../../Toast"
import editDAO from "../../../api/firebase/DAO/editDAO"
import {capitalize} from "../../../utlls"

const DecentralizeDAO: FunctionComponent<{
	gnosisAddress: string
	name: string
	members: string[]
	afterCreate: () => void
	tokenAddress: string
	totalSupply: number
	DAOType: "gallery" | "house"
}> = ({gnosisAddress, name, members, afterCreate, tokenAddress, totalSupply, DAOType}) => {
	const {account} = useContext(AuthContext)
	const {provider, signer} = useContext(EthersContext)
	const [loading, setLoading] = useState(false)
	const [foundersPercentage, setFoundersPercentage] = useState("")
	const [decisionMakingSpeed, setDecisionMakingSpeed] = useState<DAODecisionMakingSpeed>("slow")
	const [votingThreshold, setVotingThreshold] = useState("")
	const [minProposalAmount, setMinProposalAmount] = useState("")

	const handleSubmit = async () => {
		if (
			foundersPercentage &&
			votingThreshold &&
			minProposalAmount &&
			provider &&
			signer &&
			account
		) {
			setLoading(true)
			try {
				// const daoAddress = await deployERC20DAO(
				// 	name,
				// 	members,
				// 	tokenAddress,
				// 	decisionMakingSpeed === "slow" ? 1 : decisionMakingSpeed === "medium" ? 2 : 3,
				// 	totalSupply * (1 - Number(foundersPercentage) / 100),
				// 	Number(votingThreshold),
				// 	Number(minProposalAmount),
				// 	provider,
				// 	signer
				// )
				// await editDAO({
				// 	gnosisAddress,
				// 	daoAddress,
				// 	tokenAddress,
				// 	totalSupply,
				// 	decisionMakingSpeed,
				// 	daoVotingThreshold: Number(votingThreshold),
				// 	minProposalAmount: Number(minProposalAmount)
				// })
				afterCreate()
			} catch (e) {
				console.error(e)
				toastError("Failed to create DAO")
			}
			setLoading(false)
		}
	}

	const handleFoundersPercentageChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setFoundersPercentage("0")
		} else if (Number(e.target.value) > 100) {
			setFoundersPercentage("100")
		} else {
			setFoundersPercentage(e.target.value)
		}
	}

	const handleVotingThresholdChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setVotingThreshold("0")
		} else {
			setVotingThreshold(e.target.value)
		}
	}

	const handleMinProposalChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setMinProposalAmount("0")
		} else {
			setMinProposalAmount(e.target.value)
		}
	}

	const submitButtonDisabled = !(foundersPercentage && minProposalAmount && votingThreshold)

	return (
		<>
			<h2>{`Decentralize ${capitalize(DAOType)} DAO`}</h2>
			<p>{`Step 2. Add general DAO parameters.`}</p>
			<div className="decentralize-dao__row">
				<div className="decentralize-dao__col">
					<label htmlFor="decentralize-dao-ts">Total Supply</label>
					<Input id="decentralize-dao-ts" borders="all" value={totalSupply} disabled />
				</div>
				<div className="decentralize-dao__col">
					<label htmlFor="decentralize-dao-fp">Founder(s)&apos; Portion of Token Supply</label>
					<Input
						id="decentralize-dao-fp"
						borders="all"
						value={foundersPercentage}
						number
						onChange={handleFoundersPercentageChange}
						min={0}
						max={100}
					/>
				</div>
			</div>
			<div className="decentralize-dao__row">
				<div className="decentralize-dao__col">
					<label className="no-margin">Minimum Proposal Amount</label>
				</div>
				<div className="decentralize-dao__col">
					<Input
						borders="all"
						value={minProposalAmount}
						onChange={handleMinProposalChange}
						number
						min={0}
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
						min={0}
					/>
				</div>
			</div>
			<div className="decentralize-dao__row">
				<div className="decentralize-dao__col">
					<label className="no-margin">Decision Making Speed</label>
				</div>
				<div className="decentralize-dao__col">
					<div className="decentralize-dao__col-wrap sp-between">
						<div>
							<RadioButton
								label="Slow"
								id="decentralize-dao-dms-slow"
								checked={decisionMakingSpeed === "slow"}
								onChange={() => {
									setDecisionMakingSpeed("slow")
								}}
							/>
						</div>
						<div>
							<RadioButton
								label="Medium"
								id="decentralize-dao-dms-medium"
								checked={decisionMakingSpeed === "medium"}
								onChange={() => {
									setDecisionMakingSpeed("medium")
								}}
							/>
						</div>
						<div>
							<RadioButton
								label="Fast"
								id="decentralize-dao-dms-fast"
								checked={decisionMakingSpeed === "fast"}
								onChange={() => {
									setDecisionMakingSpeed("fast")
								}}
							/>
						</div>
					</div>
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
