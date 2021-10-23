import {FunctionComponent, InputHTMLAttributes} from "react"
import Input from "./index"
import SearchIcon from "../../../assets/icons/SearchIcon"

const SearchInput: FunctionComponent<
	Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "placeholder">
> = inputProps => {
	return (
		<div className="search-input">
			<SearchIcon />
			<Input borders="bottom" placeholder="Search" {...inputProps} />
		</div>
	)
}

export default SearchInput
