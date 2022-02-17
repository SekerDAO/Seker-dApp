import {FunctionComponent, useContext, useEffect, useState} from "react"
import {useHistory} from "react-router-dom"
import {buildUsulDeployTxSequence} from "../../../../api/ethers/functions/Usul/buildUsulDeployTxSequence"
import {buildMultiSendTx} from "../../../../api/ethers/functions/Usul/multiSend"
import createGnosisSafe from "../../../../api/ethers/functions/gnosisSafe/createGnosisSafe"
import {SafeTransaction} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import config from "../../../../config"
import {AuthContext} from "../../../../context/AuthContext"
import useCheckNetwork from "../../../../hooks/useCheckNetwork"
import {BuiltVotingStrategy, VotingStrategyName} from "../../../../types/DAO"
import ChooseVotingStrategies from "../ChooseVotingStrategies"
import ConfirmUsulMultiAdmin from "../ConfirmTransactions/ConfirmUsulMultiAdmin"
import ConfirmUsulMultiStrategy from "../ConfirmTransactions/ConfirmUsulMultiStrategy"
import ExpandDaoLayout from "../ExpandDaoLayout"
import STAGE_HEADERS, {ExpandDaoStage} from "./stageHeaders"

const DeployUsulMulti: FunctionComponent<{
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
	const [expectedSideChainSafeAddress, setExpectedSideChainSafeAddress] = useState("")
	const {
		push,
		location: {pathname}
	} = useHistory()

	const checkedGetSideChainSafeAddress = useCheckNetwork(createGnosisSafe, config.SIDE_CHAIN_ID)
	const checkedBuildMultiSendTx = useCheckNetwork(buildMultiSendTx, config.SIDE_CHAIN_ID)

	useEffect(() => {
		if (account && signer) {
			checkedGetSideChainSafeAddress([account], 1, signer, true, true).then(expectedAddress => {
				setExpectedSideChainSafeAddress(expectedAddress)
			})
		}
	}, [account, signer])

	const updateTransactions = async () => {
		if (!(account && signer && expectedSideChainSafeAddress)) return
		const {transactions: newTransactions, expectedUsulAddress: newExpectedUsulAddress} =
			await buildUsulDeployTxSequence(strategies, expectedSideChainSafeAddress, true)
		const newMultiTx = await checkedBuildMultiSendTx(
			newTransactions.map(t => t.tx),
			expectedSideChainSafeAddress,
			signer,
			true,
			true
		)
		setTransactions(newTransactions)
		setExpectedUsulAddress(newExpectedUsulAddress)
		setMultiTx(newMultiTx)
	}
	useEffect(() => {
		updateTransactions()
	}, [strategies, gnosisAddress, account, signer, expectedSideChainSafeAddress])

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
					gnosisAddress={expectedSideChainSafeAddress}
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
					deployType="usulMulti"
				/>
			)}
			{stage === "confirm" &&
				multiTx &&
				(votingModule === "admin" ? (
					<ConfirmUsulMultiAdmin
						multiTx={multiTx}
						transactions={transactions}
						gnosisAddress={gnosisAddress}
						gnosisVotingThreshold={gnosisVotingThreshold}
						afterSubmit={afterDeployUsul}
						expectedUsulAddress={expectedUsulAddress}
						isAdmin={isAdmin}
					/>
				) : (
					<ConfirmUsulMultiStrategy
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

export default DeployUsulMulti
