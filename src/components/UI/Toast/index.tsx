import {FunctionComponent} from "react"
import {toast} from "react-toastify"
import {ReactComponent as ToastErrorIcon} from "../../../assets/icons/toasts-error.svg"
import {ReactComponent as ToastInfoIcon} from "../../../assets/icons/toasts-info.svg"
import {ReactComponent as ToastSuccessIcon} from "../../../assets/icons/toasts-success.svg"
import {ReactComponent as ToastWarningIcon} from "../../../assets/icons/toasts-warning.svg"

const ErrorToast: FunctionComponent<{message: string}> = ({message}) => (
	<div className="toast">
		<ToastErrorIcon width="20px" height="20px" />
		{message}
	</div>
)

const WarningToast: FunctionComponent<{message: string}> = ({message}) => (
	<div className="toast">
		<ToastWarningIcon width="20px" height="20px" />
		{message}
	</div>
)

const InfoToast: FunctionComponent<{message: string}> = ({message}) => (
	<div className="toast">
		<ToastInfoIcon width="20px" height="20px" />
		{message}
	</div>
)

const SuccessToast: FunctionComponent<{message: string}> = ({message}) => (
	<div className="toast">
		<ToastSuccessIcon width="20px" height="20px" />
		{message}
	</div>
)

export const toastError = (message: string): void => {
	toast.error(<ErrorToast message={message} />, {hideProgressBar: true})
}

export const toastWarning = (message: string): void => {
	toast.warning(<WarningToast message={message} />, {hideProgressBar: true})
}

export const toastSuccess = (message: string): void => {
	toast.success(<SuccessToast message={message} />, {hideProgressBar: true})
}

export const toastInfo = (message: string): void => {
	toast.info(<InfoToast message={message} />, {hideProgressBar: true})
}
