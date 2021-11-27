import {FunctionComponent, useState} from "react"
import Button from "../../components/Controls/Button"
import SearchInput from "../../components/Controls/Input/SearchInput"
import DAOList from "../../components/DAOList"
import ErrorPlaceholder from "../../components/UI/ErrorPlaceholder"
import Loader from "../../components/UI/Loader"
import useDAOs from "../../hooks/getters/useDAOs"
import {DAOSnapshot} from "../../types/DAO"
import "./styles.scss"

const Daos: FunctionComponent = () => {
	const [cursor, setCursor] = useState<DAOSnapshot | null>(null)
	const {
		DAOs: daos,
		loading,
		error
	} = useDAOs({
		after: cursor
	})

	if (loading) return <Loader />
	if (error) return <ErrorPlaceholder />

	const handleLoadMore = () => {
		setCursor(daos.data[daos.data.length - 1].snapshot)
	}

	return (
		<div className="main__container">
			<div className="daos">
				<h1>DAOs</h1>
				<div className="daos__controls">
					<SearchInput />
				</div>
				<DAOList
					DAOs={daos.data.map(({snapshot, owners}) => {
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
				{daos.data.length < daos.totalCount && <Button onClick={handleLoadMore}>Load More</Button>}
			</div>
		</div>
	)
}

export default Daos
