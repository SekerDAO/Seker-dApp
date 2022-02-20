import {FunctionComponent, useContext, useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import {buildUsulDeployTxSequence} from "../../../../api/ethers/functions/Usul/buildUsulDeployTxSequence"
import {buildMultiSendTx} from "../../../../api/ethers/functions/Usul/multiSend"
import {SafeTransaction} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import {AuthContext} from "../../../../context/AuthContext"
import useCheckNetwork from "../../../../hooks/useCheckNetwork"
import {BuiltVotingStrategy, VotingStrategyName} from "../../../../types/DAO"
import ChooseVotingStrategies from "../ChooseVotingStrategies"
import ConfirmUsulSingleAdmin from "../ConfirmTransactions/ConfirmUsulSingleAdmin"
import ConfirmUsulSingleStrategy from "../ConfirmTransactions/ConfirmUsulSingleStrategy"
import ExpandDaoLayout from "../ExpandDaoLayout"
import STAGE_HEADERS, {ExpandDaoStage} from "./stageHeaders"

const DeployUsulSingle: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	afterDeploy: () => void
	isAdmin: boolean
	votingModule:
		| {usulAddress: string; strategyAddress: string; strategyType: VotingStrategyName}
		| "admin"
}> = ({isAdmin, gnosisAddress, gnosisVotingThreshold, afterDeploy, votingModule}) => {
	const {signer, account} = useContext(AuthContext)
	const [stage, setStage] = useState<ExpandDaoStage>("chooseStrategies")
	const [strategies, setStrategies] = useState<BuiltVotingStrategy[]>([])
	const [transactions, setTransactions] = useState<{tx: SafeTransaction; name: string}[]>([])
	const [multiTx, setMultiTx] = useState<SafeTransaction>()
	const [expectedUsulAddress, setExpectedUsulAddress] = useState("")
	const {
		push,
		location: {pathname}
	} = useHistory()

	const checkedBuildMultiSendTx = useCheckNetwork(buildMultiSendTx)

	const updateTransactions = async () => {
		if (!(account && signer)) return
		const {transactions: newTransactions, expectedUsulAddress: newExpectedUsulAddress} =
			await buildUsulDeployTxSequence(strategies, gnosisAddress, false)
		const newMultiTx = await checkedBuildMultiSendTx(
			newTransactions.map(t => t.tx),
			gnosisAddress,
			signer
		)
		setTransactions(newTransactions)
		setExpectedUsulAddress(newExpectedUsulAddress)
		setMultiTx(newMultiTx)
	}
	useEffect(() => {
		updateTransactions()
	}, [strategies, gnosisAddress, account, signer])

	const afterDeployUsul = () => {
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
					gnosisAddress={gnosisAddress}
					strategies={strategies}
					onStrategyAdd={strategy => {
						setStrategies(prevState => [...prevState, strategy])
					}}
					onStrategyRemove={index => {
						setStrategies(prevState => prevState.filter((_, idx) => idx !== index))
					}}
					onSubmit={() => {
						setStage("confirm")
					}}
					deployType="usulSingle"
				/>
			)}
			{stage === "confirm" &&
				multiTx &&
				(votingModule === "admin" ? (
					<ConfirmUsulSingleAdmin
						isAdmin={isAdmin}
						multiTx={multiTx}
						transactions={transactions}
						gnosisAddress={gnosisAddress}
						gnosisVotingThreshold={gnosisVotingThreshold}
						expectedUsulAddress={expectedUsulAddress}
						afterSubmit={afterDeployUsul}
					/>
				) : (
					<ConfirmUsulSingleStrategy
						multiTx={multiTx}
						transactions={transactions}
						gnosisAddress={gnosisAddress}
						afterSubmit={afterDeployUsul}
						expectedUsulAddress={expectedUsulAddress}
						votingUsulAddress={votingModule.usulAddress}
						votingStrategyAddress={votingModule.strategyAddress}
						votingStrategyName={votingModule.strategyType}
					/>
				))}
		</ExpandDaoLayout>
	)
}

export default DeployUsulSingle
