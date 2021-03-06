import {FunctionComponent, useRef, useState} from "react"
import {ReactComponent as VideoIcon} from "../../../assets/icons/video.svg"
import {imageTypes, videoTypes} from "../../../constants/mimeTypes"
import useFileDrop from "../../../hooks/useFileDrop"
import {toastError} from "../../UI/Toast"
import Button from "../Button"
import "./styles.scss"

const MediaUpload: FunctionComponent<{
	initialUrl?: string
	onUpload: (file: File) => void
}> = ({initialUrl, onUpload}) => {
	const [imageUrl, setImageUrl] = useState<string | null>(initialUrl ?? null)
	const [isVideo, setIsVideo] = useState(false)

	const _onUpload = (file: File) => {
		if (file.type.startsWith("image")) {
			setImageUrl(URL.createObjectURL(file))
			onUpload(file)
		} else if (file.type.startsWith("video")) {
			setIsVideo(true)
			onUpload(file)
		} else {
			toastError("Wrong file type!")
		}
	}

	const uploadRef = useRef<HTMLLabelElement | null>(null)
	const {handleFileUpload, handleDragOver, handleDrop, handleDragLeave, handleDragEnter} =
		useFileDrop({
			uploadRef,
			onUpload: _onUpload,
			acceptedMimeTypes: imageTypes
		})

	return (
		<label
			className="image-upload"
			ref={uploadRef}
			onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<input
				type="file"
				accept={imageTypes.concat(videoTypes).join(",")}
				onChange={handleFileUpload}
			/>
			<Button
				buttonType="secondary"
				onClick={() => {
					uploadRef.current?.click()
				}}
			>
				<label>Upload File</label>
			</Button>
			<div className={`image-upload__preview${imageUrl ? "" : " image-upload__preview--empty"}`}>
				{imageUrl ? (
					<img src={imageUrl} />
				) : isVideo ? (
					<div className="image-upload__icon">
						<VideoIcon />
					</div>
				) : (
					"Drop File Here"
				)}
			</div>
		</label>
	)
}

export default MediaUpload
