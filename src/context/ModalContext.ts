/// Modal context sets and removes the currently display modal on the page
// eslint-disable-next-line prettier/prettier
import React, { createContext, useState } from "react"

type ModalComponentType = React.FC | React.ReactNode | undefined
type ModalState = Partial<Record<string, ModalComponentType>>
type OverlayParams = {
	key: string
	component: ModalComponentType
}
type ModalContext = {
	setOverlay: (modal?: OverlayParams) => void
	overlay?: ModalState
}

export const useModal = (): ModalContext => {
	const [overlay, setLay] = useState<ModalState | undefined>()

	// setOverlay handles removing and setting the current modal
	const setOverlay = (data?: OverlayParams) => {
		if (data) {
			// eslint-disable-next-line prettier/prettier
			const { key, component } = data
			setLay(() => ({
				[key as string]: component
			}))
		} else {
			setLay(undefined)
		}
	}

	return {
		setOverlay,
		overlay
	}
}

export const ModalContext = createContext<ModalContext>({} as unknown as ModalContext)
