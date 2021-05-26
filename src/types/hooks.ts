import {ChangeEvent, MutableRefObject, DragEvent} from "react"

export type FileDropHook = ({
	uploadRef,
	onUpload
}: {
	uploadRef?: MutableRefObject<HTMLElement | null>
	onUpload: (file: File) => void
	acceptedMimeTypes?: readonly string[]
}) => {
	handleFileUpload: (e: ChangeEvent<HTMLInputElement>) => void
	handleDragEnter: (e: DragEvent<HTMLElement>) => void
	handleDragOver: (e: DragEvent<HTMLElement>) => void
	handleDragLeave: (e: DragEvent<HTMLElement>) => void
	handleDrop: (e: DragEvent<HTMLElement>) => void
}
