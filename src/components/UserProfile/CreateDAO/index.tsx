import React, {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import Input from "../../Controls/Input"
import RadioButton from "../../Controls/RadioButton"
import Button from "../../Controls/Button"
import {AuthContext} from "../../../context/AuthContext"
import {DAODecisionMakingSpeed, DAOMemberRole, HouseDAOTokenType, Member} from "../../../types/DAO"
import deployHouseERC20DAO from "../../../api/ethers/functions/deployHouseERC20DAO"
import "./styles.scss"
import EthersContext from "../../../context/EthersContext"
import addDAO from "../../../api/firebase/DAO/addDAO"
import {toastError} from "../../Toast"

const CreateDAO: FunctionComponent<{
	afterCreate: () => void
	tokenAddress: string
	initialName: string
	totalSupply: number
	tokenType: HouseDAOTokenType
	DAOType: "gallery" | "house"
}> = ({afterCreate, tokenAddress, initialName, totalSupply, tokenType, DAOType}) => {
	const {account} = useContext(AuthContext)
	const {provider, signer} = useContext(EthersContext)
	const [loading, setLoading] = useState(false)
	const [name, setName] = useState(initialName)
	const [foundersPercentage, setFoundersPercentage] = useState("")
	const [tax, setTax] = useState("")
	const [decisionMakingSpeed, setDecisionMakingSpeed] = useState<DAODecisionMakingSpeed>("slow")
	const [votingThreshold, setVotingThreshold] = useState("")
	const [minProposalAmount, setMinProposalAmount] = useState("")
	const [members, setMembers] = useState<Member[]>([
		{address: account!, role: DAOType === "gallery" ? "admin" : "head"}
	])

	const handleSubmit = async () => {
		if (
			name &&
			(tokenType === "NFT" || foundersPercentage) &&
			(DAOType === "house" || tax) &&
			(DAOType === "gallery" || tokenType === "NFT") &&
			members.reduce((acc, cur) => acc && !!cur.address, true) &&
			votingThreshold &&
			minProposalAmount &&
			provider &&
			signer &&
			account
		) {
			setLoading(true)
			try {
				if (DAOType === "house" && tokenType === "ERC20") {
					const address = await deployHouseERC20DAO(
						name,
						members.map(m => m.address),
						tokenAddress,
						decisionMakingSpeed === "slow" ? 1 : decisionMakingSpeed === "medium" ? 2 : 3,
						(totalSupply * Number(foundersPercentage)) / 100,
						(totalSupply * Number(foundersPercentage) * Number(votingThreshold)) / 10000,
						Number(minProposalAmount),
						provider,
						signer
					)
					await addDAO(
						{
							address,
							type: "house",
							houseTokenType: "ERC20",
							tokenAddress,
							name,
							totalSupply,
							members,
							decisionMakingSpeed,
							votingThreshold: Number(votingThreshold),
							minProposalAmount: Number(minProposalAmount)
						},
						account
					)
				} else {
					console.log(`mock create DAO ${tokenAddress} ${totalSupply}`)
				}
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

	const handleMemberAddressChange = (address: string, index: number) => {
		setMembers(prevState => prevState.map((item, idx) => (idx === index ? {...item, address} : item)))
	}

	const handleMemberRoleChange = (role: DAOMemberRole, index: number) => {
		setMembers(prevState => prevState.map((item, idx) => (idx === index ? {...item, role} : item)))
	}

	const handleMemberRoleAdd = () => {
		setMembers(prevState => [...prevState, {address: "", role: "member"}])
	}

	const handleMemberRoleRemove = (index: number) => {
		if (index === 0) return
		setMembers(prevState => prevState.filter((_, idx) => idx !== index))
	}

	const handleTaxChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setTax("0")
		} else if (Number(e.target.value) > 100) {
			setTax("100")
		} else {
			setTax(e.target.value)
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

	const submitButtonDisabled = !(
		name &&
		(tokenType === "NFT" || foundersPercentage) &&
		(DAOType === "house" || tax) &&
		(DAOType === "gallery" || tokenType === "NFT") &&
		minProposalAmount &&
		members.reduce((acc, cur) => acc && !!cur.address, true)
	)

	return (
		<>
			<h2>{`Create ${DAOType === "house" ? "House" : "Gallery"} DAO`}</h2>
			<p>{`Step ${DAOType === "house" ? 3 : 2}. Add members and general DAO parameters.`}</p>
			<label htmlFor="create-dao-name">DAO Name</label>
			<Input
				id="create-dao-name"
				borders="all"
				value={name}
				onChange={e => {
					setName(e.target.value)
				}}
			/>
			{tokenType === "ERC20" && (
				<div className="create-dao__row">
					<div className="create-dao__col">
						<label htmlFor="create-dao-ts">Total Supply</label>
						<Input id="create-dao-ts" borders="all" value={totalSupply} disabled />
					</div>
					<div className="create-dao__col">
						<label htmlFor="create-dao-fp">Founder(s)&apos; Portion of Token Supply</label>
						<Input
							id="create-dao-fp"
							borders="all"
							value={foundersPercentage}
							number
							onChange={handleFoundersPercentageChange}
							min={0}
							max={100}
						/>
					</div>
				</div>
			)}
			<div className="create-dao__row">
				<div className="create-dao__col">
					<label>Add Members</label>
				</div>
				<div className="create-dao__col">
					<label>DAO Role(s)</label>
				</div>
			</div>
			{members.map((member, index) => (
				<div className="create-dao__row" key={index}>
					<div className="create-dao__col">
						<Input
							borders="all"
							value={members[index].address}
							onChange={e => {
								handleMemberAddressChange(e.target.value, index)
							}}
						/>
					</div>
					<div className="create-dao__col">
						<div className="create-dao__col-wrap">
							{DAOType === "gallery" && (
								<RadioButton
									label="Admin"
									id={`create-dao-member-${index}-admin`}
									checked={members[index].role === "admin"}
									onChange={() => {
										handleMemberRoleChange("admin", index)
									}}
									disabled={index === 0}
								/>
							)}
							<RadioButton
								label="Member"
								id={`create-dao-member-${index}-member`}
								checked={members[index].role === "member"}
								onChange={() => {
									handleMemberRoleChange("member", index)
								}}
								disabled={index === 0}
							/>
							{DAOType === "gallery" && (
								<RadioButton
									label="NFT Contributor"
									id={`create-dao-member-${index}-contributor`}
									checked={members[index].role === "contributor"}
									onChange={() => {
										handleMemberRoleChange("contributor", index)
									}}
									disabled={index === 0}
								/>
							)}
							{DAOType === "house" && (
								<RadioButton
									label="Head of House"
									id={`create-dao-member-${index}-head`}
									checked={members[index].role === "head"}
									onChange={() => {
										handleMemberRoleChange("head", index)
									}}
									disabled={index === 0}
								/>
							)}
							{index !== 0 && (
								<Button
									buttonType="secondary"
									onClick={() => {
										handleMemberRoleRemove(index)
									}}
								>
									-
								</Button>
							)}
							<Button buttonType="primary" onClick={handleMemberRoleAdd}>
								+
							</Button>
						</div>
					</div>
				</div>
			))}
			{DAOType === "gallery" && (
				<div className="create-dao__row">
					<div className="create-dao__col">
						<label>Gallery DAO Tax</label>
					</div>
					<div className="create-dao__col">
						<Input borders="all" value={tax} onChange={handleTaxChange} />
					</div>
				</div>
			)}
			<div className="create-dao__row">
				<div className="create-dao__col">
					<label>Minimum Proposal Amount</label>
				</div>
				<div className="create-dao__col">
					<Input borders="all" value={minProposalAmount} onChange={handleMinProposalChange} number min={0} />
				</div>
			</div>
			<div className="create-dao__row">
				<div className="create-dao__col">
					<label>Voting Threshold</label>
				</div>
				<div className="create-dao__col">
					<Input borders="all" value={votingThreshold} onChange={handleVotingThresholdChange} number min={0} />
				</div>
			</div>
			<div className="create-dao__row">
				<div className="create-dao__col">
					<label>Decision Making Speed</label>
				</div>
				<div className="create-dao__col">
					<div className="create-dao__col-wrap sp-between">
						<div>
							<RadioButton
								label="Slow"
								id="create-dao-dms-slow"
								checked={decisionMakingSpeed === "slow"}
								onChange={() => {
									setDecisionMakingSpeed("slow")
								}}
							/>
						</div>
						<div>
							<RadioButton
								label="Medium"
								id="create-dao-dms-medium"
								checked={decisionMakingSpeed === "medium"}
								onChange={() => {
									setDecisionMakingSpeed("medium")
								}}
							/>
						</div>
						<div>
							<RadioButton
								label="Fast"
								id="create-dao-dms-fast"
								checked={decisionMakingSpeed === "fast"}
								onChange={() => {
									setDecisionMakingSpeed("fast")
								}}
							/>
						</div>
					</div>
				</div>
			</div>
			<Button buttonType="primary" onClick={handleSubmit} disabled={submitButtonDisabled || loading}>
				{loading ? "Processing..." : "Submit"}
			</Button>
		</>
	)
}

export default CreateDAO
