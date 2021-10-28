import {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import Paper from "../Paper"
import "./styles.scss"

const DashboardMenu: FunctionComponent<{
	currentPage: string
	items: {title: string; page: string; to: string}[]
}> = ({currentPage, items}) => {
	return (
		<Paper className="dashboard-menu">
			<h3>Dashboard Menu</h3>
			{items.map(({title, page, to}, index) => (
				<Link key={index} to={to} className={page === currentPage ? "active" : undefined}>
					{title}
				</Link>
			))}
		</Paper>
	)
}

export default DashboardMenu
