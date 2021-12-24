import {ReactComponent as DeleteIcon} from "../../../assets/icons/delete.svg"
import Paper from "../Paper"
import "./styles.scss"

type TableProps<T extends Record<string, string | number>> = {
	data: T[]
	columns: readonly {
		id: keyof T
		name: string
		render?: (data: T) => JSX.Element
		headClassName?: string
		rowClassName?: string
	}[]
	idCol: keyof T
	onItemDelete?: (itemId: string | number) => void
	noDataText?: string
}

const Table: <T extends {[key: string]: string | number}>(props: TableProps<T>) => JSX.Element = ({
	data,
	columns,
	idCol,
	onItemDelete,
	noDataText = "No data available"
}) => (
	<Paper className="table-wrapper">
		<table className="table">
			<thead>
				<tr>
					{columns.map(col => (
						<th key={col.id as string} className={col.headClassName}>
							{col.name}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{data.length ? (
					data.map((row, rowIndex) => (
						<tr key={data[rowIndex][idCol]}>
							{columns.map((col, colIndex) => (
								<td key={colIndex} className={col.rowClassName}>
									{col.render ? col.render(data[rowIndex]) : data[rowIndex][col.id]}
								</td>
							))}
							{onItemDelete && (
								<td
									onClick={() => {
										onItemDelete(data[rowIndex][idCol])
									}}
									className="table__remove-icon"
								>
									<DeleteIcon />
								</td>
							)}
						</tr>
					))
				) : (
					<tr className="table__no-data">
						<td colSpan={columns.length}>{noDataText}</td>
					</tr>
				)}
			</tbody>
		</table>
	</Paper>
)

export default Table
