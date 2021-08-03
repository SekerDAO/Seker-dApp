export const capitalize = (str: string): string => `${str[0].toUpperCase()}${str.slice(1)}`

export const throttle = <T extends unknown[]>(
	func: (...args: T) => unknown,
	delay: number
): ((...args: T) => void) => {
	let timer: NodeJS.Timeout | null = null
	return (...args): void => {
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => {
			func(...args)
		}, delay)
	}
}

export const formatTimeDifference = (ms: number): string => {
	const hours = Math.floor(ms / 3600000)
	const minutes = Math.floor((ms % 3600000) / 60000)
	return `${hours > 0 ? `${hours} h ` : ""}${minutes} m`
}
