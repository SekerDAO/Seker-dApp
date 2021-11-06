import {FunctionComponent, useState} from "react"
import {ReactComponent as GnosisSafeIcon} from "../../../assets/icons/gnosis-safe.svg"
import DeploySeele from "./Seele/DeploySeele"
import "./styles.scss"

type ExpandDAOModules = "seele" | "bridge"

const EXPAND_DAO_HEADER = {
	default: {
		heading: "Expand DAO",
		description: `
        Modules are your way of customizing, upgrading, and expanding your DAO. Here you can
        choose to swap voting strategies, add multiple strategies, or remove a strategy at any
        time. You can also introduce the Zodiac modules Bridge (for a constellation of voting
        strategies across chains), Exit (for a Moloch-style rage quit assigned to different asset
        holders), or Photon (a way to enact governance at the speed of light — coming soon).
        `
	},
	seele: {
		heading: "Seele",
		description: `
        This module allows avatars to operate with trustless tokenized DeGov, similar to Compound
        or Gitcoin, with a proposal core that can register swappable voting contracts. This
        enables DAOs to choose from various on-chain voting methods that best suit their needs.

		\n
		
		Determine which voting strateg(ies) best fit your DAO’s decision-making process, set up
		the required parameters to each, and add the strateg(ies) to the deployment queue. You
		can add as many as you would like. Once you have finished, proceed to the next step to
		confirm your transactions and deploy.
        `
	},
	bridge: {
		heading: "Bridge",
		description: "This module is not implemented yet. Try to choose it later"
	}
}

const ExpandDAO: FunctionComponent = () => {
	const [selectedModule, setSelectedModule] = useState<ExpandDAOModules>()
	const selectedModuleContent = EXPAND_DAO_HEADER[selectedModule || "default"]

	const handleReturnToExpandDao = () => {
		// We might want to do some clean up here, but for now - it's enough to just reset the state to show initial
		// Expand DAO page with modules selection
		setSelectedModule(undefined)
	}
	return (
		<section className="expand-dao">
			<div className="expand-dao__header">
				<h2>{selectedModuleContent.heading}</h2>
				<p>{selectedModuleContent.description}</p>
			</div>
			<div className="expand-dao__content">
				{!selectedModule && (
					<div className="expand-dao__modules">
						<div className="expand-dao__modules-gnosis-safe">
							<GnosisSafeIcon width="225px" height="225px" />
						</div>
						<div className="expand-dao__modules-connectable">
							<div
								className="expand-dao__modules-seele"
								onClick={() => setSelectedModule("seele")}
							/>
						</div>
					</div>
				)}
				{selectedModule === "seele" && (
					<DeploySeele onReturnToExpandDAO={handleReturnToExpandDao} />
				)}
			</div>
		</section>
	)
}

export default ExpandDAO
