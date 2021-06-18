import React, {FunctionComponent, useRef, useState} from "react"
import Button from "../Button"
import useFileDrop from "../../../customHooks/useFileDrop"
import {imageTypes, videoTypes} from "../../../constants/mimeTypes"
import "./styles.scss"
import {toastError} from "../../Toast"

const MediaUpload: FunctionComponent<{
	onUpload: (file: File) => void
}> = ({onUpload}) => {
	const [imageUrl, setImageUrl] = useState<string | null>(null)
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
	const {handleFileUpload, handleDragOver, handleDrop, handleDragLeave, handleDragEnter} = useFileDrop({
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
			<input type="file" accept={imageTypes.concat(videoTypes).join(",")} onChange={handleFileUpload} />
			<Button buttonType="secondary">
				<label>Upload File</label>
			</Button>
			<div className="image-upload__preview" style={imageUrl ? {backgroundImage: `url("${imageUrl}")`} : undefined}>
				{isVideo && "TODO: video icon"}
			</div>
		</label>
	)
}

export default MediaUpload