import React, {FunctionComponent} from "react"
import Button from "../../Controls/Button"
import Modal from "../../Modal"
import RadioButton from "../../Controls/RadioButton"
import Select from "../../Controls/Select"
import "./styles.scss"
import CreateERC20Token from "../CreateERC20Token"
import Input from "../../Controls/Input"
import useCreateGalleryDAOModal from "./hook"

const CreateGalleryDAOModal: FunctionComponent = () => {
	const {
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
	} = useCreateGalleryDAOModal()

	return (
		<>
			<Button
				buttonType="primary"
				onClick={() => {
					setIsOpened(true)
				}}
			>
				Create A Gallery DAO
			</Button>
			<Modal show={isOpened} onClose={handleClose}>
				<div className={`create-gallery-dao${stage === "enterInfo" ? " create-gallery-dao--wide" : ""}`}>
					{stage === "chooseToken" && (
						<>
							<h2>Create Gallery DAO</h2>
							<p>Step 1. Choose one.</p>
							<div className="create-gallery-dao__row">
								<RadioButton
									label="Select Existing Token"
									id="create-gallery-dao-existing-token"
									checked={!createNewToken}
									onChange={() => {
										setCreateNewToken(false)
									}}
								/>
								<Select
									options={[
										{
											name: "Select Token",
											value: ""
										}
									].concat(mockTokens.map(token => ({name: token.name, value: token.address})))}
									disabled={createNewToken}
									onChange={handleTokenChange}
								/>
							</div>
							<div className="create-gallery-dao__row">
								<RadioButton
									label="Create New Token"
									id="create-gallery-dao-new-token"
									checked={createNewToken}
									onChange={() => {
										setCreateNewToken(true)
									}}
								/>
							</div>
						</>
					)}
					{stage === "createToken" && <CreateERC20Token afterCreate={handleERC20Create} />}
					{stage === "enterInfo" && (
						<>
							<h2>Create Gallery DAO</h2>
							<p>Step 2. Add Members And General DAO Parameters.</p>
							<label htmlFor="create-gallery-dao-name">DAO Name</label>
							<Input
								id="create-gallery-dao-name"
								borders="all"
								value={name}
								onChange={e => {
									setName(e.target.value)
								}}
							/>
							<div className="create-gallery-dao__row">
								<div className="create-gallery-dao__col">
									<label htmlFor="create-gallery-dao-ts">Total Supply</label>
									<Input id="create-gallery-dao-ts" borders="all" value={totalSupply} disabled />
								</div>
								<div className="create-gallery-dao__col">
									<label htmlFor="create-gallery-dao-fp">Founder(s)&apos; Portion Of Token</label>
									<Input
										id="create-gallery-dao-fp"
										borders="all"
										value={foundersPercentage}
										number
										onChange={handleFoundersPercentageChange}
										min={0}
										max={100}
									/>
								</div>
							</div>
							<div className="create-gallery-dao__row">
								<div className="create-gallery-dao__col">
									<label>Add Members</label>
								</div>
								<div className="create-gallery-dao__col">
									<label>Gallery DAO Role(s)</label>
								</div>
							</div>
							{members.map((member, index) => (
								<div className="create-gallery-dao__row" key={index}>
									<div className="create-gallery-dao__col">
										<Input
											borders="all"
											value={members[index].address}
											onChange={e => {
												handleMemberAddressChange(e.target.value, index)
											}}
										/>
									</div>
									<div className="create-gallery-dao__col">
										<div className="create-gallery-dao__col-wrap">
											<RadioButton
												label="Admin"
												id={`create-gallery-dao-member-${index}-admin`}
												checked={members[index].role === "admin"}
												onChange={() => {
													handleMemberRoleChange("admin", index)
												}}
												disabled={index === 0}
											/>
											<RadioButton
												label="Member"
												id={`create-gallery-dao-member-${index}-member`}
												checked={members[index].role === "member"}
												onChange={() => {
													handleMemberRoleChange("member", index)
												}}
												disabled={index === 0}
											/>
											<RadioButton
												label="NFT Contributor"
												id={`create-gallery-dao-member-${index}-contributor`}
												checked={members[index].role === "contributor"}
												onChange={() => {
													handleMemberRoleChange("contributor", index)
												}}
												disabled={index === 0}
											/>
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
							<div className="create-gallery-dao__row">
								<div className="create-gallery-dao__col">
									<label>Gallery DAO Tax</label>
								</div>
								<div className="create-gallery-dao__col">
									<Input borders="all" value={tax} onChange={handleTaxChange} />
								</div>
							</div>
							<div className="create-gallery-dao__row">
								<div className="create-gallery-dao__col">
									<label>Decision Making Speed</label>
								</div>
								<div className="create-gallery-dao__col">
									<div className="create-gallery-dao__col-wrap sp-between">
										<div>
											<RadioButton
												label="Slow"
												id="create-gallery-dao-dms-slow"
												checked={decisionMakingSpeed === "slow"}
												onChange={() => {
													setDecisionMakingSpeed("slow")
												}}
											/>
										</div>
										<div>
											<RadioButton
												label="Medium"
												id="create-gallery-dao-dms-medium"
												checked={decisionMakingSpeed === "medium"}
												onChange={() => {
													setDecisionMakingSpeed("medium")
												}}
											/>
										</div>
										<div>
											<RadioButton
												label="Fast"
												id="create-gallery-dao-dms-fast"
												checked={decisionMakingSpeed === "fast"}
												onChange={() => {
													setDecisionMakingSpeed("fast")
												}}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="create-gallery-dao__row">
								<div className="create-gallery-dao__col">
									<label>Voting Threshold</label>
								</div>
								<div className="create-gallery-dao__col">
									<div className="create-gallery-dao__col-wrap sp-between">
										<div>
											<RadioButton
												label="Low"
												id="create-gallery-dao-vt-low"
												checked={votingThreshold === "low"}
												onChange={() => {
													setVotingThreshold("low")
												}}
											/>
										</div>
										<div>
											<RadioButton
												label="Medium"
												id="create-gallery-dao-vt-medium"
												checked={votingThreshold === "medium"}
												onChange={() => {
													setVotingThreshold("medium")
												}}
											/>
										</div>
										<div>
											<RadioButton
												label="High"
												id="create-gallery-dao-vt-high"
												checked={votingThreshold === "high"}
												onChange={() => {
													setVotingThreshold("high")
												}}
											/>
										</div>
									</div>
								</div>
							</div>
						</>
					)}
					{["chooseToken", "enterInfo"].includes(stage) && (
						<Button buttonType="primary" onClick={handleSubmit} disabled={submitButtonDisabled}>
							{stage === "chooseToken" ? "Continue" : "Submit"}
						</Button>
					)}
					{stage === "success" && (
						<>
							<h2>Success!</h2>
							<p>
								You can now see the gallery DAO you have created
								<br />
								(along with other DAOs you currently belong to) and access the DAO
								<br />
								dashboard on the &quot;View Your DAOs&quot; page of your user dashboard.
							</p>
						</>
					)}
				</div>
			</Modal>
		</>
	)
}

export default CreateGalleryDAOModal
