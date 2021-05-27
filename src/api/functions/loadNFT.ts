import {Web3Provider} from "@ethersproject/providers"
// prettier-ignore
import MultiArtToken from "../abis/MultiArtToken.json"
import {Contract} from "@ethersproject/contracts"
import firebase from "firebase"

// prettier-ignore
const checkOwner = async (account: string, address: string, id: string, provider: Web3Provider | null): Promise<boolean> => {
	try{
		// @ts-expect-error: Let's ignore a compile error like this unreachable code
		const nftContract = new Contract(address, MultiArtToken.abi, provider)
		const owner = await nftContract.ownerOf(id)
		return owner === account
	} catch (err) {
		return false
	}
}

// prettier-ignore
// @ts-expect-error: Let's ignore a compile error like this unreachable code
const getNFTMetadata = async (nftAddress: string, nftId: string, provider: Web3Provider | null): Promise<string> => {
	try{
		// @ts-expect-error: Let's ignore a compile error like this unreachable code
		const nftContract = new Contract(nftAddress, MultiArtToken.abi, provider)
		const uri = await nftContract.tokenURI(nftId)
		console.log(uri)
	    await fetch(uri)
	      .then(res => res.json())
	      .then(
	        (result) => {
	        	console.log(result)
	        	// this wont return for some reason
	        	return JSON.stringify(result)
	        },
	        (error) => {
	        	console.log(error)
	        	return error
	        }
	      )
	} catch (err) {

	}
}

// prettier-ignore
const getNFTImage = async (metadata: string): Promise<void> => {
    fetch(JSON.parse(metadata).image)
      .then(response => response.blob())
      .then(
        (result) => {
        	console.log(result)
			const outside = URL.createObjectURL(result)
			console.log(outside)
			//todo: return the image and begin DB storage
        },
        (error) => {
        	console.log(error)
        }
      )
}

const loadNFT = async (account: string, address: string, id: string): Promise<void> => {
	//todo: enter into DB here
}

export {loadNFT, checkOwner, getNFTMetadata, getNFTImage}
