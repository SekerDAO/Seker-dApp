import {FunctionComponent, useState} from "react"
import useDAOs from "../../customHooks/getters/useDAOs"
import {DAOSnapshot} from "../../types/DAO"
import Loader from "../../components/Loader"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import Input from "../../components/Controls/Input"
import SearchIcon from "../../icons/SearchIcon"
import DAOList from "../../components/DAOList"
import Button from "../../components/Controls/Button"
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
					DAOs={DAOs.data.map(({snapshot, owners}) => {
						const {name, description, profileImage} = snapshot.data()
						return {
							gnosisAddress: snapshot.id,
							name,
							description,
							owners,
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
