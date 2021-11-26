import {ReactComponent as SearchIcon} from "../../../assets/icons/search.svg"
import Input from "./index"
import {FunctionComponent, InputHTMLAttributes} from "react"

const SearchInput: FunctionComponent<
	Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "placeholder">
> = inputProps => (
	<div className="search-input">
		<SearchIcon width="17px" height="17px" />
		<Input borders="bottom" placeholder="Search" {...inputProps} />
	</div>
)

export default SearchInput
