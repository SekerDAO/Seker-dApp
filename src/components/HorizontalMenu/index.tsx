import {FunctionComponent} from "react"
import "./styles.scss"

const HorizontalMenu: FunctionComponent<{
	entries: string[]
	activeIndex: number
	onChange: (index: number) => void
}> = ({entries, activeIndex, onChange}) => (
	<div className="horizontal-menu">
		{entries.map((entry, index) => (
			<div
				key={index}
				onClick={() => {
					onChange(index)
				}}
				className={`horizontal-menu__item${
					index === activeIndex ? " horizontal-menu__item--active" : ""
				}`}
			>
				{entry}
			</div>
		))}
	</div>
)

export default HorizontalMenu
