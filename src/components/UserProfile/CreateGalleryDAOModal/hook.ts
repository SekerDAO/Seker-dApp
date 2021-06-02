import {ChangeEvent, useContext, useState} from "react"
import {AuthContext} from "../../../context/AuthContext"
import {DAODecisionMakingSpeed, DAOMemberRole, DAOVotingThreshold} from "../../../types/DAO"

type CreateGalleryDAOStage = "chooseToken" | "createToken" | "enterInfo" | "success"

type Member = {
	address: string
	role: DAOMemberRole
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useCreateGalleryDAOModal = () => {
	// TODO
	const mockTokens = [
		{
			name: "Mock Token 1",
			address: "0xFF",
			totalSupply: 1000
		},
		{
			name: "Mock Token 2",
			address: "0xAA",
			totalSupply: 10000
		}
	]

	const {account} = useContext(AuthContext)
	const [isOpened, setIsOpened] = useState(false)
	const [stage, setStage] = useState<CreateGalleryDAOStage>("chooseToken")
	const [createNewToken, setCreateNewToken] = useState(true)
	const [token, setToken] = useState("")
	const [name, setName] = useState("")
	const [totalSupply, setTotalSupply] = useState("")
	const [foundersPercentage, setFoundersPercentage] = useState("")
	const [tax, setTax] = useState("")
	const [decisionMakingSpeed, setDecisionMakingSpeed] = useState<DAODecisionMakingSpeed>("slow")
	const [votingThreshold, setVotingThreshold] = useState<DAOVotingThreshold>("low")
	const [members, setMembers] = useState<Member[]>([{address: account!, role: "admin"}])

	const handleClose = () => {
		setIsOpened(false)
		setStage("chooseToken")
		setCreateNewToken(true)
		setToken("")
		setName("")
		setTotalSupply("")
		setFoundersPercentage("")
		setTax("")
		setDecisionMakingSpeed("slow")
		setVotingThreshold("low")
		setMembers([{address: account!, role: "admin"}])
	}

	const handleTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
		const tkn = mockTokens.find(tok => tok.address === e.target.value)
		if (!tkn) return
		setToken(tkn.address)
		setName(tkn.name)
		setTotalSupply(String(tkn.totalSupply))
	}

	const handleSubmit = () => {
		if (stage === "chooseToken") {
			if (createNewToken) {
				setStage("createToken")
			} else if (token) {
				setStage("enterInfo")
			}
		} else if (
			stage === "enterInfo" &&
			name &&
			foundersPercentage &&
			tax &&
			members.reduce((acc, cur) => acc && !!cur.address, true)
		) {
			console.log("mock create DAO")
			setStage("success")
		}
	}

	const handleERC20Create = (newName: string, symbol: string, address: string, newTotalSupply: number) => {
		setName(newName)
		setToken(address)
		setTotalSupply(String(newTotalSupply))
		setStage("enterInfo")
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

	const submitButtonDisabled =
		(stage === "chooseToken" && !(createNewToken || token)) ||
		(stage === "enterInfo" &&
			!(name && foundersPercentage && tax && members.reduce((acc, cur) => acc && !!cur.address, true)))

	return {
		mockTokens,
		isOpened,
		setIsOpened,
		stage,
		createNewToken,
		setCreateNewToken,
		name,
		setName,
		totalSupply,
		foundersPercentage,
		tax,
		decisionMakingSpeed,
		setDecisionMakingSpeed,
		votingThreshold,
		setVotingThreshold,
		members,
		handleClose,
		handleTokenChange,
		handleSubmit,
		handleERC20Create,
		handleFoundersPercentageChange,
		handleMemberAddressChange,
		handleMemberRoleChange,
		handleMemberRoleAdd,
		handleMemberRoleRemove,
		handleTaxChange,
		submitButtonDisabled
	}
}

export default useCreateGalleryDAOModal
