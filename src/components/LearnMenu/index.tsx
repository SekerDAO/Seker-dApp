import React, {FunctionComponent, useState, Fragment} from "react"
import {Learn} from "../../types/learn"
import "./styles.scss"

const LearnMenu: FunctionComponent<{
	entries: Learn
}> = ({entries}) => {
	const [expandedEntries, setExpandedEntries] = useState<boolean[]>(new Array(entries.length).fill(false))

	const toggleEntryExpand = (index: number) => {
		setExpandedEntries(prevState => prevState.map((entry, idx) => (idx === index ? !entry : entry)))
	}

	return (
		<div className="learn-menu">
			{entries.map((lv0Entry, lv0Index) => (
				<Fragment key={lv0Index}>
					<div className="learn-menu__link-lv0">
						<a href={`#learn_${lv0Index}`}>{lv0Entry.title}</a>
						<span
							onClick={() => {
								toggleEntryExpand(lv0Index)
							}}
							className={`learn-menu__expand${expandedEntries[lv0Index] ? " learn-menu__expand--expanded" : ""}`}
						/>
					</div>
					{expandedEntries[lv0Index] &&
						lv0Entry.childArticles.map((lv1Entry, lv1Index) => (
							<Fragment key={lv1Index}>
								<a className="learn-menu__link-lv1" href={`#learn_${lv0Index}_${lv1Index}`}>
									{lv1Entry.title}
								</a>
								{lv1Entry.childArticles.map((lv2Entry, lv2Index) => (
									<a
										key={lv2Index}
										className="learn-menu__link-lv2"
										href={`#learn_${lv0Index}_${lv1Index}_${lv2Index}`}
									>
										{lv2Entry.title}
									</a>
								))}
							</Fragment>
						))}
				</Fragment>
			))}
		</div>
	)
}

export default LearnMenu
