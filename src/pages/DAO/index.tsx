import React, {FunctionComponent, useState} from "react"
import {useParams} from "react-router-dom"
import HorizontalMenu from "../../components/HorizontalMenu"
import "./styles.scss"

const menuEntries = ["About", "Members", "Proposals", "Create Proposal", "Collection"]

const DAOPage: FunctionComponent = () => {
	const {address} = useParams<{address: string}>()
	const [activeMenuIndex, setActiveMenuIndex] = useState(0)

	return (
		<div className="dao">
			<div className="dao__left-section">
				<div className="dao__photo" />
				<div className="dao__info">
					<h2>TODO: name</h2>
					<p>TODO: est.</p>
					<p>TODO: website</p>
				</div>
			</div>
			<div className="dao__main">
				<HorizontalMenu
					entries={menuEntries}
					activeIndex={activeMenuIndex}
					onChange={index => {
						setActiveMenuIndex(index)
					}}
				/>
			</div>
		</div>
	)
}

export default DAOPage
