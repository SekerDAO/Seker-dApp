import {FunctionComponent, InputHTMLAttributes} from "react"
import {ReactComponent as SearchIcon} from "../../../assets/icons/search.svg"
import Input from "./index"

const SearchInput: FunctionComponent<
	Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "placeholder">
> = inputProps => (
	<div className="search-input">
		<SearchIcon width="17px" height="17px" />
		{/* eslint-disable-next-line react/jsx-props-no-spreading */}
		<Input borders="bottom" placeholder="Search" {...inputProps} />
	</div>
)

export default SearchInput
