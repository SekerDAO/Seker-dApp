import {create, urlSource} from "ipfs-http-client"
// @ts-expect-error: Let's ignore a compile error like this unreachable code
const client = create("https://ipfs.infura.io:5001")
//import firebase from "firebase"

// prettier-ignore
const uploadMediaIPFS = async (file: any, account: string): Promise<string> => {
	try{
		const res = await client.add(file)
		// todo: save image and hash in the database
		return res.path
	} catch (err) {
		return err
	}
}

// TODO: edit this to store the metadata on a folder and add the whole folder
// not sure how to do this with netlify server
// prettier-ignore
const uploadMetadataIPFS = async (hash: string, title: string, numberOfEditions: string, account: string): Promise<string[]> => {
	const hashes = []
	for(let i = 0; i < parseInt(numberOfEditions, 10); i++){
		const metadata = {
			"name": title,
			"description": "A decription of the specific nft", //todo
			"external_url": "https://tokenwalk.com/nftaddress/nftid", //todo
			"image": "https://ipfs.io/ipfs/"+hash,
			"media":{
				"uri":"https://ipfs.io/ipfs/"+hash,
				"dimensions":"2188x2500","size":"22142080","mimeType":"video/mp4" //todo
			},
			"attributes": {
				"original" : "false",
				"edition-number" : i,
				"royalty" : "10%" //todo
			} 
		}
		try{
			const res = await client.add(JSON.stringify(metadata))
			// todo: save image and hash in the database
			hashes.push(res.path)
		} catch (err) {
			hashes.push(err)
		}
	}
	return hashes
}

const getMetadataIPFS = async (cid: string): Promise<string | undefined> => {
	try {
		const res = await client.get(cid)
		for await (const value of res) {
			// @ts-expect-error: Let's ignore a compile error like this unreachable code
			for await (const content of value.content) {
				console.log(content.toString("utf8"))
				return content.toString("utf8")
			}
		}
	} catch (err) {
		console.log(err)
		return err
	}
}

export {uploadMediaIPFS, uploadMetadataIPFS, getMetadataIPFS}
