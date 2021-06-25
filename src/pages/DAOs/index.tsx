import React, {ChangeEvent, FunctionComponent, useState} from "react"
import useDAOs from "../../customHooks/getters/useDAOs"
import {DAOSnapshot, DAOType} from "../../types/DAO"
import Loader from "../../components/Loader"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import Input from "../../components/Controls/Input"
import SearchIcon from "../../icons/SearchIcon"
import Select from "../../components/Controls/Select"
import DAOList from "../../components/DAOList"
import Button from "../../components/Controls/Button"
import "./styles.scss"

const DAOsPage: FunctionComponent = () => {
	const [daoType, setDaoType] = useState<DAOType | "">("")
	const [cursor, setCursor] = useState<DAOSnapshot | null>(null)
	const {DAOs, loading, error} = useDAOs({
		...(daoType ? {type: daoType} : {}),
		after: cursor
	})

	if (loading) return <Loader />
	if (error) return <ErrorPlaceholder />

	const handleLoadMore = () => {
		setCursor(DAOs.data[DAOs.data.length - 1].snapshot)
	}

	const handleFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setDaoType(e.target.value as "")
		setCursor(null)
	}

	return (
		<div className="daos">
			<h1>DAOs</h1>
			<div className="daos__controls">
				<div className="daos__search">
					<Input placeholder="Search" borders="bottom" />
					<SearchIcon />
				</div>
				<Select
					options={[
						{name: "Type", value: ""},
						{name: "Gallery", value: "gallery"},
						{name: "House", value: "house"}
					]}
					value={daoType}
					onChange={handleFilterChange}
				/>
			</div>
			<DAOList
				DAOs={DAOs.data.map(({snapshot, membersCount}) => {
					const {name, description, type, houseTokenType} = snapshot.data()
					return {
						address: snapshot.id,
						name,
						description,
						type,
						houseTokenType,
						membersCount
					}
				})}
			/>
			{DAOs.data.length < DAOs.totalCount && <Button onClick={handleLoadMore}>Load More</Button>}
		</div>
	)
}

export default DAOsPage
