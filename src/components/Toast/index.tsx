import React, {FunctionComponent} from "react"
import ToastErrorIcon from "../../icons/ToastErrorIcon"
import {toast} from "react-toastify"
import ToastWarningIcon from "../../icons/ToastWarningIcon"
import ToastInfoIcon from "../../icons/ToastInfoIcon"
import ToastSuccessIcon from "../../icons/ToastSuccessIcon"

const ErrorToast: FunctionComponent<{message: string}> = ({message}) => (
	<div className="toast">
		<ToastErrorIcon />
		{message}
	</div>
)

const WarningToast: FunctionComponent<{message: string}> = ({message}) => (
	<div className="toast">
		<ToastWarningIcon />
		{message}
	</div>
)

const InfoToast: FunctionComponent<{message: string}> = ({message}) => (
	<div className="toast">
		<ToastInfoIcon />
		{message}
	</div>
)

const SuccessToast: FunctionComponent<{message: string}> = ({message}) => (
	<div className="toast">
		<ToastSuccessIcon />
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
