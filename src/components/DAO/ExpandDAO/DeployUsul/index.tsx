import {FunctionComponent, useContext, useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import buildUsulDeployTxSequence from "../../../../api/ethers/functions/Usul/buildUsulDeployTxSequence"
import {buildMultiSendTx} from "../../../../api/ethers/functions/Usul/multiSend"
import {SafeTransaction} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import EthersContext from "../../../../context/EthersContext"
import useProposals from "../../../../hooks/getters/useProposals"
import {BuiltVotingStrategy} from "../../../../types/DAO"
import {SafeProposal} from "../../../../types/safeProposal"
import ErrorPlaceholder from "../../../UI/ErrorPlaceholder"
import ChooseVotingStrategies from "../ChooseVotingStrategies"
import ConfirmDeployUsul from "../ConfirmDeployUsul"
import ExpandDaoLayout from "../ExpandDaoLayout"

type ExpandDaoStage = "chooseStrategies" | "confirm"

const STAGE_HEADERS: {[key in ExpandDaoStage]: {title?: string; description?: string}} = {
	chooseStrategies: {
		title: "Usul",
		description: `This module allows avatars to operate with trustless tokenized DeGov, similar to Compound
        or Gitcoin, with a proposal core that can register swappable voting contracts. This
        enables DAOs to choose from various on-chain voting methods that best suit their needs.
		
		Determine which voting strateg(ies) best fit your DAO’s decision-making process, set up
		the required parameters to each, and add the strateg(ies) to the deployment queue. You
		can add as many as you would like. Once you have finished, proceed to the next step to
		confirm your transactions and deploy.`
	},
	confirm: {
		title: "Confirm Bundle Transactions"
	}
}

const DeployUsul: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	afterDeploy: () => void
}> = ({gnosisAddress, gnosisVotingThreshold, afterDeploy}) => {
	const {signer} = useContext(EthersContext)
	const [stage, setStage] = useState<ExpandDaoStage>("chooseStrategies")
	const [strategies, setStrategies] = useState<BuiltVotingStrategy[]>([])
	const [transactions, setTransactions] = useState<{tx: SafeTransaction; name: string}[]>([])
	const [multiTx, setMultiTx] = useState<SafeTransaction>()
	const [expectedUsulAddress, setExpectedUsulAddress] = useState("")
	const {proposals, error, refetch} = useProposals(gnosisAddress)
	const {
		push,
		location: {pathname}
	} = useHistory()

	useEffect(() => {
		if (signer) {
			buildUsulDeployTxSequence(strategies, gnosisAddress, signer).then(res => {
				setTransactions(res.transactions)
				setExpectedUsulAddress(res.expectedUsulAddress)
			})
		}
	}, [strategies, gnosisAddress, signer])

	useEffect(() => {
		if (proposals) {
			const expandProposal = proposals.find(
				proposal => (proposal as SafeProposal).type === "decentralizeDAO"
			)
			if (expandProposal?.state === "active") {
				push(`${pathname}?page=proposal&type=safe&id=${expandProposal.proposalId}`)
			} else if (expandProposal?.state === "executed") {
				afterDeploy()
				push(`${pathname}?page=collection`)
			}
		}
	}, [proposals])

	if (error) return <ErrorPlaceholder />

	const handleProceedToConfirm = async () => {
		if (signer) {
			setMultiTx(
				await buildMultiSendTx(
					transactions.map(t => t.tx),
					gnosisAddress,
					signer
				)
			)
			setStage("confirm")
		}
	}

	return (
		<ExpandDaoLayout
			title={STAGE_HEADERS[stage].title}
			description={STAGE_HEADERS[stage].description}
			onGoBack={stage === "confirm" ? () => setStage("chooseStrategies") : undefined}
		>
			{stage === "chooseStrategies" && (
				<ChooseVotingStrategies
					gnosisAddress={gnosisAddress}
					strategies={strategies}
					transactions={transactions}
					onStrategyAdd={strategy => {
						setStrategies(prevState => [...prevState, strategy])
					}}
					onStrategyRemove={index => {
						setStrategies(prevState => prevState.filter((_, idx) => idx !== index))
					}}
					onSubmit={handleProceedToConfirm}
				/>
			)}
			{stage === "confirm" && (
				<ConfirmDeployUsul
					multiTx={multiTx}
					transactions={transactions}
					gnosisAddress={gnosisAddress}
					gnosisVotingThreshold={gnosisVotingThreshold}
					expectedUsulAddress={expectedUsulAddress}
					afterSubmit={refetch}
				/>
			)}
		</ExpandDaoLayout>
	)
}

export default DeployUsul
