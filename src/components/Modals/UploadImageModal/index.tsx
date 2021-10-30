import {FunctionComponent, useContext, useState} from "react"
import Button from "../../Controls/Button"
import "./styles.scss"
import MediaUpload from "../../Controls/MediaUpload"
import {toastError, toastSuccess} from "../../UI/Toast"
import {ModalContext} from "../../../context/ModalContext"

const UploadImageModal: FunctionComponent<{
	initialUrl?: string
	titleText: string
	onUpload: (file: File) => Promise<void>
	successToastText: string
	errorToastText: string
}> = ({initialUrl, titleText, onUpload, successToastText, errorToastText}) => {
	const {setOverlay} = useContext(ModalContext)
	const [image, setImage] = useState<File | null>(null)
	const [processing, setProcessing] = useState(false)

	const handleSave = async () => {
		if (!image) return
		setProcessing(true)
		try {
			await onUpload(image)
			toastSuccess(successToastText)
			setOverlay()
		} catch (e) {
			console.error(e)
			toastError(errorToastText)
		}
		setProcessing(false)
	}

	return (
		<div className="upload-image-modal">
			<h2>{titleText}</h2>
			<MediaUpload
				onUpload={file => {
					setImage(file)
				}}
				initialUrl={initialUrl}
			/>
			<Button onClick={handleSave} disabled={!image || processing}>
				{processing ? "Processing..." : "Save"}
			</Button>
		</div>
	)
}

export default UploadImageModal
