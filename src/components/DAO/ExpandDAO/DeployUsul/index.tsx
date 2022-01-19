import {FunctionComponent, useContext, useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import buildUsulDeployTxSequence from "../../../../api/ethers/functions/Usul/buildUsulDeployTxSequence"
import {buildMultiSendTx} from "../../../../api/ethers/functions/Usul/multiSend"
import createGnosisSafe from "../../../../api/ethers/functions/gnosisSafe/createGnosisSafe"
import {SafeTransaction} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import config from "../../../../config"
import {AuthContext} from "../../../../context/AuthContext"
import useProposals from "../../../../hooks/getters/useProposals"
import useCheckNetwork from "../../../../hooks/useCheckNetwork"
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
	isAdmin: boolean
	deployType: "usulSingle" | "usulMulti"
}> = ({isAdmin, gnosisAddress, gnosisVotingThreshold, afterDeploy, deployType}) => {
	const {signer, account} = useContext(AuthContext)
	const [stage, setStage] = useState<ExpandDaoStage>("chooseStrategies")
	const [strategies, setStrategies] = useState<BuiltVotingStrategy[]>([])
	const [transactions, setTransactions] = useState<{tx: SafeTransaction; name: string}[]>([])
	const [multiTx, setMultiTx] = useState<SafeTransaction>()
	const [expectedUsulAddress, setExpectedUsulAddress] = useState("")
	const [expectedSideChainSafeAddress, setExpectedSideChainSafeAddress] = useState("")
	const {proposals, error, refetch} = useProposals(gnosisAddress)
	const {
		push,
		location: {pathname}
	} = useHistory()

	const checkedGetSideChainSafeAddress = useCheckNetwork(createGnosisSafe, config.SIDE_CHAIN_ID)
	const checkedBuildUsulDeployTxSequence = useCheckNetwork(
		buildUsulDeployTxSequence,
		deployType === "usulSingle" ? config.CHAIN_ID : config.SIDE_CHAIN_ID
	)
	const checkedBuildMultiSendTx = useCheckNetwork(
		buildMultiSendTx,
		deployType === "usulSingle" ? config.CHAIN_ID : config.SIDE_CHAIN_ID
	)

	const updateTransactions = async () => {
		if (!(account && signer)) return
		if (deployType === "usulSingle") {
			const {transactions: newTransactions, expectedUsulAddress: newExpectedUsulAddress} =
				await checkedBuildUsulDeployTxSequence(strategies, gnosisAddress, signer)
			const newMultiTx = await checkedBuildMultiSendTx(
				transactions.map(t => t.tx),
				gnosisAddress,
				signer
			)
			setTransactions(newTransactions)
			setExpectedUsulAddress(newExpectedUsulAddress)
			setMultiTx(newMultiTx)
		} else {
			let sideChainSafeAddress = expectedSideChainSafeAddress
			if (!sideChainSafeAddress) {
				const newAddress = await checkedGetSideChainSafeAddress([account], 1, signer, true, true)
				setExpectedSideChainSafeAddress(newAddress)
				sideChainSafeAddress = newAddress
			}
			const {transactions: newTransactions} = await checkedBuildUsulDeployTxSequence(
				strategies,
				sideChainSafeAddress,
				signer,
				true
			)
			const newMultiTx = await checkedBuildMultiSendTx(
				transactions.map(t => t.tx),
				sideChainSafeAddress,
				signer,
				true,
				true
			)
			setTransactions(newTransactions)
			setMultiTx(newMultiTx)
		}
	}
	useEffect(() => {
		updateTransactions()
	}, [strategies, gnosisAddress, account, signer])

	useEffect(() => {
		if (proposals) {
			const expandProposal = proposals.find(
				proposal => (proposal as SafeProposal).type === "decentralizeDAO"
			)
			if (expandProposal?.state === "executed") {
				afterDeploy()
				push(`${pathname}?page=collection`)
			}
		}
	}, [proposals])

	if (error) return <ErrorPlaceholder />

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
					onSubmit={() => {
						setStage("confirm")
					}}
					deployType={deployType}
				/>
			)}
			{stage === "confirm" && (
				<ConfirmDeployUsul
					isAdmin={isAdmin}
					multiTx={multiTx}
					transactions={transactions}
					gnosisAddress={gnosisAddress}
					gnosisVotingThreshold={gnosisVotingThreshold}
					expectedUsulAddress={expectedUsulAddress}
					afterSubmit={refetch}
					deployType={deployType}
				/>
			)}
		</ExpandDaoLayout>
	)
}

export default DeployUsul
