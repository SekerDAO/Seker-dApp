import {FileDropHook} from "../types/hooks"
import {ChangeEvent, DragEvent} from "react"

const useFileDrop: FileDropHook = ({uploadRef, onUpload, acceptedMimeTypes}) => {
	const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			onUpload(e.target.files[0])
		}
	}

	const handleDragEnter = (e: DragEvent<HTMLElement>) => {
		e.preventDefault()
		if (uploadRef?.current) {
			uploadRef.current.classList.add("drag-over")
		}
	}

	const handleDragOver = (e: DragEvent<HTMLElement>) => {
		e.preventDefault()
	}

	const handleDragLeave = (e: DragEvent<HTMLElement>) => {
		e.preventDefault()
		if (uploadRef?.current) {
			uploadRef.current.classList.remove("drag-over")
		}
	}

	const handleDrop = (e: DragEvent<HTMLElement>) => {
		e.preventDefault()
		e.persist()
		if (uploadRef?.current) {
			uploadRef.current.classList.remove("drag-over")
		}
		const file = e.dataTransfer.files[0]
		if (file && (!acceptedMimeTypes || acceptedMimeTypes.includes(file.type))) {
			onUpload(file)
		}
	}

	return {
		handleFileUpload,
		handleDragOver,
		handleDrop,
		handleDragLeave,
		handleDragEnter
	}
}

export default useFileDrop
