import {FunctionComponent, useContext, useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import {buildSetUsulTransactionsTxSequence} from "../../../../api/ethers/functions/Usul/buildUsulDeployTxSequence"
import {buildMultiSendTx} from "../../../../api/ethers/functions/Usul/multiSend"
import {SafeTransaction} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import config from "../../../../config"
import {AuthContext} from "../../../../context/AuthContext"
import useCheckNetwork from "../../../../hooks/useCheckNetwork"
import {BuiltVotingStrategy, VotingStrategyName} from "../../../../types/DAO"
import ChooseVotingStrategies from "../ChooseVotingStrategies"
import ConfirmAddStrategies from "../ConfirmTransactions/ConfirmAddStrategies"
import ExpandDaoLayout from "../ExpandDaoLayout"
import STAGE_HEADERS, {ExpandDaoStage} from "./stageHeaders"

const AddUsulStrategies: FunctionComponent<{
	gnosisAddress: string
	usulSafeAddress: string
	afterDeploy: () => void
	usulAddress: string
	votingStrategyAddress: string
	votingStrategyName: VotingStrategyName
	sideChain: boolean
}> = ({
	gnosisAddress,
	usulSafeAddress,
	afterDeploy,
	usulAddress,
	votingStrategyAddress,
	votingStrategyName,
	sideChain
}) => {
	const {signer, account} = useContext(AuthContext)
	const [stage, setStage] = useState<ExpandDaoStage>("chooseStrategies")
	const [strategies, setStrategies] = useState<BuiltVotingStrategy[]>([])
	const [transactions, setTransactions] = useState<{tx: SafeTransaction; name: string}[]>([])
	const [multiTx, setMultiTx] = useState<SafeTransaction>()
	const {
		push,
		location: {pathname}
	} = useHistory()

	const checkedBuildMultiSendTx = useCheckNetwork(
		buildMultiSendTx,
		sideChain ? config.SIDE_CHAIN_ID : config.CHAIN_ID
	)

	const updateTransactions = async () => {
		if (!(account && signer)) return
		const newTransactions = [
			...strategies.map(strategy => ({tx: strategy.tx, name: strategy.strategy})),
			...buildSetUsulTransactionsTxSequence(strategies, usulAddress, sideChain)
		]
		const newMultiTx = await checkedBuildMultiSendTx(
			newTransactions.map(t => t.tx),
			usulSafeAddress,
			signer
		)
		setTransactions(newTransactions)
		setMultiTx(newMultiTx)
	}
	useEffect(() => {
		updateTransactions()
	}, [strategies, usulSafeAddress, account, signer])

	const afterAddStrategies = () => {
		afterDeploy()
		push(`${pathname}?page=proposals`)
	}

	return (
		<ExpandDaoLayout
			title={STAGE_HEADERS[stage].title}
			description={STAGE_HEADERS[stage].description}
			onGoBack={stage === "confirm" ? () => setStage("chooseStrategies") : undefined}
		>
			{stage === "chooseStrategies" && (
				<ChooseVotingStrategies
					gnosisAddress={usulSafeAddress}
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
					deployType={sideChain ? "usulMulti" : "usulSingle"}
				/>
			)}
			{stage === "confirm" && multiTx && (
				<ConfirmAddStrategies
					multiTx={multiTx}
					transactions={transactions}
					gnosisAddress={gnosisAddress}
					afterSubmit={afterAddStrategies}
					usulAddress={usulAddress}
					votingStrategyAddress={votingStrategyAddress}
					votingStrategyName={votingStrategyName}
					sideChain={sideChain}
				/>
			)}
		</ExpandDaoLayout>
	)
}

export default AddUsulStrategies
