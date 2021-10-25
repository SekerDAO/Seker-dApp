import React, {FunctionComponent, useState} from "react"
import Button from "../../Controls/Button"
import MediaUpload from "../../Controls/MediaUpload"
import {toastError, toastSuccess} from "../../Toast"
import Modal from "../Modal"
import "./styles.scss"

const UploadImageModal: FunctionComponent<{
	initialUrl?: string
	buttonName: string
	titleText: string
	onUpload: (file: File) => Promise<void>
	successToastText: string
	errorToastText: string
}> = ({initialUrl, titleText, buttonName, onUpload, successToastText, errorToastText}) => {
	const [isOpened, setIsOpened] = useState(false)
	const [image, setImage] = useState<File | null>(null)
	const [processing, setProcessing] = useState(false)

	const handleSave = async () => {
		if (!image) return
		setProcessing(true)
		try {
			await onUpload(image)
			toastSuccess(successToastText)
			setIsOpened(false)
		} catch (e) {
			console.error(e)
			toastError(errorToastText)
		}
		setProcessing(false)
	}

	return (
		<>
			<Button
				buttonType="secondary"
				onClick={() => {
					setIsOpened(true)
				}}
			>
				{buttonName}
			</Button>
			<Modal>
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
			</Modal>
		</>
	)
}

export default UploadImageModal
