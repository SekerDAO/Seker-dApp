import {formatEther} from "@ethersproject/units"
import {FunctionComponent, useContext, useState} from "react"
import deployBridge from "../../../../api/ethers/functions/AMB/deployBridge"
import {
	executeMultiSend,
	getPrebuiltMultiSend,
	signMultiSend
} from "../../../../api/ethers/functions/Usul/multiSend"
import {submitProposal} from "../../../../api/ethers/functions/Usul/usulProposal"
import createGnosisSafe from "../../../../api/ethers/functions/gnosisSafe/createGnosisSafe"
import {
	executeRegisterModuleTx,
	getPrebuiltRegisterModuleTx,
	getRegisterModuleTx,
	signRegisterModuleTx
} from "../../../../api/ethers/functions/gnosisSafe/registerModule"
import {
	getNonce,
	SafeSignature,
	SafeTransaction
} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import addUsul from "../../../../api/firebase/DAO/addUsul"
import addSafeProposal from "../../../../api/firebase/safeProposal/addSafeProposal"
import addStrategyProposal from "../../../../api/firebase/strategyProposal/addStrategyProposal"
import {ReactComponent as ArrowDown} from "../../../../assets/icons/arrow-down.svg"
import {ReactComponent as WarningIcon} from "../../../../assets/icons/warning.svg"
import config from "../../../../config"
import {AuthContext} from "../../../../context/AuthContext"
import useCheckNetwork from "../../../../hooks/useCheckNetwork"
import {UsulDeployType, VotingStrategyName} from "../../../../types/DAO"
import {formatReadableAddress} from "../../../../utlls"
import Button from "../../../Controls/Button"
import TransactionDetailsModal from "../../../Modals/TransactionDetailsModal"
import Copy from "../../../UI/Copy"
import Paper from "../../../UI/Paper"
import {toastError, toastSuccess} from "../../../UI/Toast"
import "./styles.scss"

const ConfirmDeployUsul: FunctionComponent<{
	multiTx?: SafeTransaction
	transactions: {tx: SafeTransaction; name: string}[]
	gnosisAddress: string
	gnosisVotingThreshold: number
	afterSubmit: () => void
	expectedUsulAddress: string
	isAdmin: boolean
	deployType: UsulDeployType
	proposalModule:
		| {usulAddress: string; strategyAddress: string; strategyType: VotingStrategyName}
		| "admin"
}> = ({
	multiTx,
	transactions,
	gnosisAddress,
	gnosisVotingThreshold,
	afterSubmit,
	expectedUsulAddress,
	isAdmin,
	deployType,
	proposalModule
}) => {
	const {account, balance, signer} = useContext(AuthContext)
	const [openedTxDetails, setOpenedTxDetails] = useState<
		{tx: SafeTransaction; name: string} | undefined
	>()
	const [loading, setLoading] = useState(false)

	const checkedDeploySideNetSafe = useCheckNetwork(createGnosisSafe, config.SIDE_CHAIN_ID)
	const checkedSignMultiSend = useCheckNetwork(
		signMultiSend,
		deployType === "usulMulti" ? config.SIDE_CHAIN_ID : config.CHAIN_ID
	)
	const checkedExecuteMultiSend = useCheckNetwork(
		executeMultiSend,
		deployType === "usulMulti" ? config.SIDE_CHAIN_ID : config.CHAIN_ID
	)
	const checkedDeployBridge = useCheckNetwork(deployBridge)
	const checkedSignRegisterModule = useCheckNetwork(signRegisterModuleTx)
	const checkedExecuteRegisterModule = useCheckNetwork(executeRegisterModuleTx)
	const checkedGetNonce = useCheckNetwork(getNonce)
	const checkedSubmitProposal = useCheckNetwork(submitProposal)
	const checkedGetRegisterModuleTx = useCheckNetwork(getRegisterModuleTx)

	const handleTxDetailsClose = () => {
		setOpenedTxDetails(undefined)
	}

	const handleSubmit = async () => {
		if (!(signer && account && multiTx)) return
		setLoading(true)
		try {
			if (deployType === "usulSingle") {
				if (proposalModule === "admin") {
					const nonce = await checkedGetNonce(gnosisAddress, signer)
					let signature: SafeSignature
					if (isAdmin) {
						;[signature] = await checkedSignMultiSend(multiTx, gnosisAddress, signer)
						if (gnosisVotingThreshold === 1) {
							await checkedExecuteMultiSend(multiTx, gnosisAddress, [signature], signer)
							await addUsul({
								gnosisAddress,
								usul: {
									usulAddress: expectedUsulAddress,
									deployType: "usulSingle"
								}
							})
						}
					}
					await addSafeProposal({
						type: "decentralizeDAO",
						gnosisAddress,
						nonce,
						multiTx,
						usulAddress: expectedUsulAddress,
						title: "Decentralize DAO",
						state: gnosisVotingThreshold === 1 && isAdmin ? "executed" : "active",
						signatures: isAdmin ? [signature!] : [],
						usulDeployType: "usulSingle"
					})
				} else {
					const proposalId = await checkedSubmitProposal(
						proposalModule.usulAddress,
						proposalModule.strategyAddress,
						[multiTx],
						signer
					)
					await addStrategyProposal({
						type: "deployUsul",
						gnosisAddress,
						id: proposalId,
						usulAddress: proposalModule.usulAddress,
						strategyAddress: proposalModule.strategyAddress,
						strategyType: proposalModule.strategyType,
						title: "Deploy Usul",
						transactions: [getPrebuiltMultiSend(transactions.map(t => t.tx))],
						newUsulAddress: expectedUsulAddress
					})
				}
			} else {
				const sideNetSafeAddress = await checkedDeploySideNetSafe([account], 1, signer, false, true)
				const [multiSendSignature] = await checkedSignMultiSend(multiTx, sideNetSafeAddress, signer)
				await checkedExecuteMultiSend(multiTx, sideNetSafeAddress, [multiSendSignature], signer)
				const bridgeAddress = await checkedDeployBridge(gnosisAddress, sideNetSafeAddress, signer)
				if (proposalModule === "admin") {
					const nonce = await checkedGetNonce(gnosisAddress, signer)
					let registerBridgeSignature: SafeSignature
					if (isAdmin) {
						;[registerBridgeSignature] = await checkedSignRegisterModule(
							gnosisAddress,
							bridgeAddress,
							signer
						)
						if (gnosisVotingThreshold === 1) {
							await checkedExecuteRegisterModule(
								gnosisAddress,
								bridgeAddress,
								[registerBridgeSignature],
								signer
							)
							await addUsul({
								gnosisAddress,
								usul: {
									usulAddress: expectedUsulAddress,
									deployType: "usulMulti",
									bridgeAddress,
									sideNetSafeAddress
								}
							})
						}
					}
					await addSafeProposal({
						type: "decentralizeDAO",
						gnosisAddress,
						nonce,
						multiTx,
						usulAddress: expectedUsulAddress,
						sideNetSafeAddress,
						bridgeAddress,
						title: "Decentralize DAO",
						state: gnosisVotingThreshold === 1 && isAdmin ? "executed" : "active",
						signatures: isAdmin ? [registerBridgeSignature!] : [],
						usulDeployType: "usulMulti"
					})
				} else {
					const proposalId = await checkedSubmitProposal(
						proposalModule.usulAddress,
						proposalModule.strategyAddress,
						[await checkedGetRegisterModuleTx(gnosisAddress, bridgeAddress, signer)],
						signer
					)
					await addStrategyProposal({
						type: "deployUsul",
						gnosisAddress,
						id: proposalId,
						usulAddress: proposalModule.usulAddress,
						strategyAddress: proposalModule.strategyAddress,
						strategyType: proposalModule.strategyType,
						title: "Deploy Usul",
						transactions: [getPrebuiltRegisterModuleTx(gnosisAddress, bridgeAddress)],
						newUsulAddress: expectedUsulAddress,
						sideNetSafeAddress,
						bridgeAddress
					})
				}
			}
			toastSuccess(
				gnosisVotingThreshold === 1 && isAdmin && proposalModule === "admin"
					? "Usul module successfully deployed"
					: "Expand DAO proposal successfully created"
			)
			afterSubmit()
		} catch (e) {
			toastError("Failed to expand DAO")
			console.error(e)
		}
		setLoading(false)
	}

	const transactionsTotal = transactions.reduce(
		(current, {tx: {value}}) => current + Number(value),
		0
	)
	return (
		<Paper className="confirm-deploy-usul">
			<div className="confirm-deploy-usul__general-data">
				<div className="confirm-deploy-usul__general-data-row">
					<label>From</label>
					<Copy value={account}>{formatReadableAddress(account)}</Copy>
					{balance && (
						<span className="confirm-deploy-usul__data-balance">
							Balance: {formatEther(balance)} ETH
						</span>
					)}
				</div>
				<div className="confirm-deploy-usul__general-data-row">
					<div className="confirm-deploy-usul__general-data-col">
						<label>Send {transactionsTotal} ETH to</label>
						<Copy value={multiTx?.to}>{formatReadableAddress(multiTx?.to)}</Copy>
					</div>
					<div className="confirm-deploy-usul__general-data-col">
						<label>Data (Hex Encoded)</label>
						<Copy value={multiTx?.data}>{(multiTx?.data.length as number) / 2 - 2} bytes</Copy>
					</div>
				</div>
			</div>
			<ul className="confirm-deploy-usul__transaction-list">
				{transactions.map(({tx, name}, index) => (
					<li
						key={index}
						className="confirm-deploy-usul__transaction-row"
						onClick={() => setOpenedTxDetails({tx, name})}
					>
						<div>
							<span>Contract Interaction</span>
						</div>
						<div>
							<span className="confirm-deploy-usul__transaction-name">{name}</span>
							<ArrowDown width="14px" height="7px" />
						</div>
					</li>
				))}
				<li
					className="confirm-deploy-usul__transaction-row"
					onClick={() => setOpenedTxDetails({tx: multiTx as SafeTransaction, name: "multiSend"})}
				>
					<div>
						<span>Contract Interaction</span>
					</div>
					<div>
						<span className="confirm-deploy-usul__transaction-name">multiSend</span>
						<ArrowDown width="14px" height="7px" />
					</div>
				</li>
				<TransactionDetailsModal
					transaction={openedTxDetails}
					show={!!openedTxDetails}
					onClose={handleTxDetailsClose}
				/>
			</ul>
			<div className="confirm-deploy-usul__warning-message">
				<WarningIcon width="20px" height="20px" />
				<span>
					{`This request will incur a gas fee. If you would like to proceed, please click "Confirm and
					Create Proposal" below.`}
				</span>
			</div>
			<Button
				disabled={loading}
				onClick={handleSubmit}
				extraClassName="confirm-deploy-usul__footer-button"
			>
				{loading
					? "Submitting..."
					: gnosisVotingThreshold === 1 && isAdmin && proposalModule === "admin"
					? "Confirm and Deploy Usul"
					: "Confirm and Create Proposal"}
			</Button>
		</Paper>
	)
}

export default ConfirmDeployUsul
