import {FunctionComponent, useState} from "react"
import {ReactComponent as LeftArrowGrey} from "../../../../assets/icons/left-arrow-grey.svg"
import {ReactComponent as LeftArrowPurple} from "../../../../assets/icons/left-arrow-purple.svg"
import {ReactComponent as RightArrowGrey} from "../../../../assets/icons/right-arrow-grey.svg"
import {ReactComponent as RightArrowPurple} from "../../../../assets/icons/right-arrow-purple.svg"
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
				<div onClick={handleLeftArrowClick}>
					{shift === 0 ? <LeftArrowGrey /> : <LeftArrowPurple />}
				</div>
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
				<div onClick={handleRightArrowClick}>
					{shift >= strategies.length - 3 ? <RightArrowGrey /> : <RightArrowPurple />}
				</div>
			</div>
		</div>
	)
}

export default UsulStrategiesList
