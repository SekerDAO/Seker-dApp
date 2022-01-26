import {createContext, useState} from "react"

type MetamaskWarnModalContext = {
	modalOpened: boolean
	open: () => void
	close: () => void
}

export const useMetamaskWarnModal = (): MetamaskWarnModalContext => {
	const [modalOpened, setModalOpened] = useState(false)

	const open = () => {
		setModalOpened(true)
	}

	const close = () => {
		setModalOpened(false)
	}

	return {
		modalOpened,
		open,
		close
	}
}

const MetamaskWarnModalContext = createContext<MetamaskWarnModalContext>(
	{} as MetamaskWarnModalContext
)

export default MetamaskWarnModalContext
