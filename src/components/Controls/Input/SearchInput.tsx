import {FunctionComponent, InputHTMLAttributes} from "react"
import Input from "./index"
import {ReactComponent as SearchIcon} from "../../../assets/icons/search.svg"

const SearchInput: FunctionComponent<
	Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "placeholder">
> = inputProps => {
	return (
		<div className="search-input">
			<SearchIcon width="17px" height="17px" />
			<Input borders="bottom" placeholder="Search" {...inputProps} />
		</div>
	)
}

export default SearchInput
