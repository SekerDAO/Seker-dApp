import React, {FunctionComponent, useRef, useState} from "react"
import Button from "../Button"
import useFileDrop from "../../../customHooks/useFileDrop"
import acceptedImageTypes from "../../../constants/acceptedImageTypes"
import "./styles.scss"

const ImageUpload: FunctionComponent<{
	onUpload: (file: File) => void
}> = ({onUpload}) => {
	const [imageUrl, setImageUrl] = useState<string | null>(null)

	const _onUpload = (file: File) => {
		setImageUrl(URL.createObjectURL(file))
		onUpload(file)
	}

	const uploadRef = useRef<HTMLLabelElement | null>(null)
	const {handleFileUpload, handleDragOver, handleDrop, handleDragLeave, handleDragEnter} = useFileDrop({
		uploadRef,
		onUpload: _onUpload,
		acceptedMimeTypes: acceptedImageTypes
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
			<input type="file" accept={acceptedImageTypes.join(",")} onChange={handleFileUpload} />
			<Button buttonType="secondary">
				<label>Upload File</label>
			</Button>
			<div className="image-upload__preview" style={imageUrl ? {backgroundImage: `url("${imageUrl}")`} : undefined} />
		</label>
	)
}

export default ImageUpload
