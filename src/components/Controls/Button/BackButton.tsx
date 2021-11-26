import {ReactComponent as ArrowDown} from "../../../assets/icons/arrow-down.svg"
import Button from "./"
import {FunctionComponent} from "react"

const BackButton: FunctionComponent<{onClick: () => void}> = ({onClick}) => (
	<Button onClick={onClick} buttonType="link" extraClassName="back-button">
		<ArrowDown width="10px" height="20px" />
		Back
	</Button>
)

export default BackButton
