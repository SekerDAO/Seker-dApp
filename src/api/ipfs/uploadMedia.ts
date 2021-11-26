import {NFTMetadata} from "../../types/NFT"
import createImage from "../../utlls/createImage"
import client from "./client"

const uploadMedia = async (
	file: File,
	title: string,
	description: string,
	numberOfEditions: number
): Promise<[Omit<NFTMetadata, "attributes">, string[]]> => {
	if (
		numberOfEditions > 50 ||
		numberOfEditions <= 0 ||
		isNaN(numberOfEditions) ||
		!Number.isInteger(numberOfEditions)
	) {
		throw new Error("Number of editions should be an integer between 1 and 50")
	}
	const {path} = await client.add(file)
	let dimensions = ""
	if (file.type.startsWith("image")) {
		const image = await createImage(file)
		dimensions = `${image.width}x${image.height}`
	}
	const hashes = []
	const metadata = {
		name: title,
		description,
		external_url: `https://ipfs.io/ipfs/${path}`,
		image: `https://ipfs.io/ipfs/${path}`,
		media: {
			uri: `https://ipfs.io/ipfs/${path}`,
			dimensions,
			size: file.size,
			mimeType: file.type
		}
	}
	for (let i = 0; i < numberOfEditions; i++) {
		const res = await client.add(
			JSON.stringify({
				...metadata,
				attributes: {
					numberOfEditions,
					editionNumber: i + 1,
					original: i === 0
				}
			})
		)
		hashes.push("https://gateway.ipfs.io/ipfs/" + res.path)
	}
	return [metadata, hashes]
}

export default uploadMedia
