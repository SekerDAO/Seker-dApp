import {FunctionComponent, useContext, useState} from "react"
import {
	createSafeSignature,
	executeSafeTx
} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import addSafeProposal from "../../../../api/firebase/safeProposal/addSafeProposal"
import {AuthContext} from "../../../../context/AuthContext"
import EthersContext from "../../../../context/EthersContext"
import {PrebuiltTx} from "../../../../types/common"
import {prepareArguments} from "../../../../utlls"
import {toastError, toastSuccess} from "../../../UI/Toast"
import GeneralEvm from "../GeneralEvm"

const GeneralEvmAdminProposal: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	title: string
	description: string
	afterSubmit: () => void
}> = ({gnosisAddress, gnosisVotingThreshold, title, description, afterSubmit}) => {
	const {account} = useContext(AuthContext)
	const {signer} = useContext(EthersContext)
	const [processing, setProcessing] = useState(false)

	const handleSubmit = async (txs: PrebuiltTx[]) => {
		// TODO
		const address = txs[0].address
		const contractMethods = txs[0].contractMethods
		const selectedMethodIndex = txs[0].selectedMethodIndex
		const args = txs[0].args

		if (!(title && signer && account)) return
		setProcessing(true)
		try {
			const [signature, nonce] = await createSafeSignature(
				gnosisAddress,
				address,
				contractMethods,
				contractMethods[selectedMethodIndex].name,
				prepareArguments(
					args,
					contractMethods[selectedMethodIndex].inputs.map(i => i.type)
				),
				signer
			)
			if (gnosisVotingThreshold === 1) {
				await executeSafeTx(
					gnosisAddress,
					address,
					contractMethods,
					contractMethods[selectedMethodIndex].name,
					prepareArguments(
						args,
						contractMethods[selectedMethodIndex].inputs.map(i => i.type)
					),
					signer,
					[signature]
				)
			}
			await addSafeProposal({
				type: "generalEVM",
				title,
				description,
				nonce,
				gnosisAddress,
				signatures: [signature],
				state: gnosisVotingThreshold === 1 ? "executed" : "active",
				contractAddress: address,
				contractAbi: contractMethods,
				contractMethod: contractMethods[selectedMethodIndex].name,
				callArgs: args.reduce(
					(acc, cur, index) => ({
						...acc,
						[contractMethods[selectedMethodIndex].inputs[index].name]: cur
					}),
					{}
				)
			})
			afterSubmit()
			toastSuccess("Proposal successfully created!")
		} catch (e) {
			console.error(e)
			toastError("Failed to create proposal")
		}
		setProcessing(false)
	}

	return <GeneralEvm buttonDisabled={!title} processing={processing} onSubmit={handleSubmit} />
}

export default GeneralEvmAdminProposal
