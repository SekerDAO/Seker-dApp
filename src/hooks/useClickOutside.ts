import {RefObject, useEffect} from "react"

const useClickOutside = (ref: RefObject<HTMLElement | null>, onClickOutside: () => void): void => {
	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			if (ref.current) {
				if (!ref.current.contains(event.target as Node)) {
					onClickOutside()
				}
			}
		}
		document.addEventListener("click", handleClick)
		return () => {
			document.removeEventListener("click", handleClick)
		}
	}, [ref, onClickOutside])
}

export default useClickOutside
