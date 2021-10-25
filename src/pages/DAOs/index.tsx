import React, {FunctionComponent, useState} from "react"
import Button from "../../components/Controls/Button"
import Input from "../../components/Controls/Input"
import DAOList from "../../components/DAOList"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import Loader from "../../components/Loader"
import useDAOs from "../../customHooks/getters/useDAOs"
import SearchIcon from "../../icons/SearchIcon"
import {DAOSnapshot} from "../../types/DAO"
import "./styles.scss"

const DAOsPage: FunctionComponent = () => {
	const [cursor, setCursor] = useState<DAOSnapshot | null>(null)
	const {DAOs, loading, error} = useDAOs({
		after: cursor
	})

	if (loading) return <Loader />
	if (error) return <ErrorPlaceholder />

	const handleLoadMore = () => {
		setCursor(DAOs.data[DAOs.data.length - 1].snapshot)
	}

	return (
		<div className="main__container">
			<div className="daos">
				<h1>DAOs</h1>
				<div className="daos__controls">
					<div className="daos__search">
						<Input placeholder="Search" borders="bottom" />
						<SearchIcon />
					</div>
				</div>
				<DAOList
					DAOs={DAOs.data.map(({snapshot, membersCount}) => {
						const {name, description, profileImage} = snapshot.data()
						return {
							gnosisAddress: snapshot.id,
							name,
							description,
							membersCount,
							profileImage
						}
					})}
				/>
				{DAOs.data.length < DAOs.totalCount && <Button onClick={handleLoadMore}>Load More</Button>}
			</div>
		</div>
	)
}

export default DAOsPage
