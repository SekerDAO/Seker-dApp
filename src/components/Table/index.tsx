import React from "react"
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
}

const Table: <T extends {[key: string]: string | number}>(props: TableProps<T>) => JSX.Element = ({
	data,
	columns,
	idCol
}) => (
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
			{data.map((row, rowIndex) => (
				<tr key={data[rowIndex][idCol]}>
					{columns.map((col, colIndex) => (
						<td key={colIndex} className={col.rowClassName}>
							{col.render ? col.render(data[rowIndex]) : data[rowIndex][col.id]}
						</td>
					))}
				</tr>
			))}
		</tbody>
	</table>
)

export default Table
