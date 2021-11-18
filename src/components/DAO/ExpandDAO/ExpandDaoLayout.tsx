import {FunctionComponent} from "react"
import Button from "../../Controls/Button"
import {ReactComponent as ArrowDown} from "../../../assets/icons/arrow-down.svg"

const ExpandDaoLayout: FunctionComponent<{
	title?: string
	description?: string
	showBackButton?: boolean
	onGoBack?: () => void
}> = ({title, description, showBackButton, onGoBack, children}) => (
	<>
		{(title || description) && (
			<div className="expand-dao__header">
				{showBackButton && (
					<Button buttonType="link" onClick={onGoBack} extraClassName="expand-dao__back-button">
						<ArrowDown width="10px" height="20px" />
						Back
					</Button>
				)}
				{title && <h2>{title}</h2>}
				{description && <p>{description}</p>}
			</div>
		)}
		<div className="expand-dao__content">{children}</div>
	</>
)

export default ExpandDaoLayout
