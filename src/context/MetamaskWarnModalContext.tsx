import {createContext, FunctionComponent, useState} from "react"

type MetamaskWarnModalContext = {
	modalOpened: boolean
	open: () => void
	close: () => void
}

const useMetamaskWarnModal = (): MetamaskWarnModalContext => {
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

export const MetamaskWarnModalContext = createContext<MetamaskWarnModalContext>(
	{} as MetamaskWarnModalContext
)

export const MetamaskWarnModalProvider: FunctionComponent = ({children}) => {
	const metamaskWarnModal = useMetamaskWarnModal()

	return (
		<MetamaskWarnModalContext.Provider value={metamaskWarnModal}>
			{children}
		</MetamaskWarnModalContext.Provider>
	)
}
