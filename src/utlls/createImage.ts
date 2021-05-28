const createImage = (file: File): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file)
		const image = new Image()

		image.onload = () => {
			resolve(image)
		}

		image.onerror = e => {
			reject(e)
		}

		image.src = url
	})

export default createImage
