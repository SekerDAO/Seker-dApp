import {FunctionComponent} from "react"
import "./styles.scss"

const HorizontalMenu: FunctionComponent<{
	pages: {id: string; name: string}[]
	currentPage: string
	onChange: (page: string) => void
}> = ({pages, currentPage, onChange}) => (
	<div className="horizontal-menu">
		{pages.map(({id, name}, index) => (
			<div
				key={index}
				onClick={() => {
					onChange(id)
				}}
				className={`horizontal-menu__item${
					currentPage === id ? " horizontal-menu__item--active" : ""
				}`}
			>
				{name}
			</div>
		))}
	</div>
)

export default HorizontalMenu
