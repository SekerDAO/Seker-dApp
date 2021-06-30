export const capitalize = (str: string): string => `${str[0].toUpperCase()}${str.slice(1)}`

export const throttle = <T extends unknown[]>(func: (...args: T) => unknown, delay: number): ((...args: T) => void) => {
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
