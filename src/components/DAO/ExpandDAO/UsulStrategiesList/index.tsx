import {FunctionComponent, useState} from "react"
import {VOTING_STRATEGIES} from "../../../../constants/votingStrategies"
import {VotingStrategy} from "../../../../types/DAO"
import "./styles.scss"

const UsulStrategiesList: FunctionComponent<{
	strategies: VotingStrategy[]
}> = ({strategies}) => {
	const [shift, setShift] = useState(0)

	const handleLeftArrowClick = () => {
		if (shift === 0) return
		setShift(prevState => prevState - 1)
	}

	const handleRightArrowClick = () => {
		if (shift >= strategies.length - 3) return
		setShift(prevState => prevState + 1)
	}

	return (
		<div className="usul-strategies-list">
			<div
				className={`usul-strategies-list__arrow${
					shift === 0 ? " usul-strategies-list__arrow--disabled" : ""
				}`}
			>
				<div
					onClick={handleLeftArrowClick}
					style={{width: "20px", height: "40px", background: "green"}}
				/>
			</div>
			{strategies.slice(shift, shift + 3).map((s, index) => {
				const strategy = VOTING_STRATEGIES.find(strat => strat.strategy === s.name)
				if (!strategy) return null
				const icon = strategy.cardImageMini
				return (
					<div key={index} className="usul-strategies-list__strategy">
						<img src={icon} width={160} height={160} />
						<p>
							<b>{strategy.titleMini}</b>
						</p>
						<p>{strategy.descriptionMini}</p>
					</div>
				)
			})}
			<div
				className={`usul-strategies-list__arrow${
					shift >= strategies.length - 3 ? " usul-strategies-list__arrow--disabled" : ""
				}`}
			>
				<div
					onClick={handleRightArrowClick}
					style={{width: "20px", height: "40px", background: "green"}}
				/>
			</div>
		</div>
	)
}

export default UsulStrategiesList
